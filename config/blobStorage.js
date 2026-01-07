const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

class BlobStorage {
    constructor() {
        console.log('🔧 Initializing Azure Blob Storage...');
        
        // Check environment variables
        if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
            console.error('❌ ERROR: AZURE_STORAGE_CONNECTION_STRING is missing in .env file');
            throw new Error('Azure Storage connection string is missing');
        }
        
        this.connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
        this.containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'photos';
        
        console.log(`📦 Container: ${this.containerName}`);
        console.log(`🔑 Connection string length: ${this.connectionString.length}`);
        
        try {
            this.blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
            this.containerClient = this.blobServiceClient.getContainerClient(this.containerName);
            console.log('✅ Azure Blob clients created successfully');
        } catch (error) {
            console.error('❌ Failed to create Azure clients:', error.message);
            throw error;
        }
        
        this.initializeContainer();
    }

    async initializeContainer() {
        try {
            await this.containerClient.createIfNotExists({
                access: 'blob' // Public read access for blobs
            });
            console.log(`✅ Azure Blob Storage container "${this.containerName}" is ready`);
        } catch (error) {
            console.error('❌ Blob Storage initialization failed:', error.message);
        }
    }

    /**
     * Upload a file to blob storage WITH METADATA
     * @param {Buffer} fileBuffer - File buffer
     * @param {String} fileName - Original file name
     * @param {String} mimeType - File MIME type
     * @param {Object} metadata - Additional metadata (title, description, etc.)
     * @returns {Object} - Upload result with URL
     */
    async uploadFile(fileBuffer, fileName, mimeType, metadata = {}) {
        try {
            console.log('\n📤 ===== STARTING AZURE UPLOAD =====');
            console.log('File:', fileName);
            console.log('Type:', mimeType);
            console.log('Size:', fileBuffer.length, 'bytes');
            console.log('Metadata to send:', metadata);
            
            // Generate unique filename
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            const extension = fileName.split('.').pop();
            const blobName = `${timestamp}-${randomString}.${extension}`;
            
            console.log('Generated blob name:', blobName);
            
            // Get block blob client
            const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
            
            // Prepare metadata for Azure (Azure requires simple key-value pairs)
            const azureMetadata = {
                originalFilename: fileName,
                uploadedAt: new Date().toISOString(),
                type: 'image',
                // Add user metadata (make sure values are strings)
                ...Object.fromEntries(
                    Object.entries(metadata).map(([key, value]) => [
                        key,
                        typeof value === 'string' ? value : JSON.stringify(value)
                    ])
                )
            };
            
            console.log('Azure metadata format:', azureMetadata);
            
            // ⚠️ CRITICAL: Upload file WITH metadata
            const uploadOptions = {
                blobHTTPHeaders: {
                    blobContentType: mimeType
                },
                metadata: azureMetadata  // This sends metadata to Azure
            };
            
            console.log('Upload options prepared');
            
            // Upload the file
            console.log('⚡ Uploading to Azure...');
            await blockBlobClient.upload(fileBuffer, fileBuffer.length, uploadOptions);
            console.log('✅ File uploaded to Azure');
            
            // Verify metadata was actually saved
            console.log('🔍 Verifying metadata storage...');
            const properties = await blockBlobClient.getProperties();
            
            if (properties.metadata && Object.keys(properties.metadata).length > 0) {
                console.log('✅ Metadata verified in Azure:', properties.metadata);
            } else {
                console.warn('⚠️ No metadata found after upload (check Azure permissions)');
            }
            
            // Get public URL
            const url = blockBlobClient.url;
            
            console.log('🌐 Public URL:', url);
            console.log('🎉 ===== UPLOAD COMPLETE =====\n');
            
            return {
                success: true,
                url: url,
                blobName: blobName,
                originalName: fileName,
                contentType: mimeType,
                size: fileBuffer.length,
                metadata: azureMetadata  // Return metadata for reference
            };
            
        } catch (error) {
            console.error('❌ Upload error:', error.message);
            console.error('Error details:', {
                code: error.code,
                statusCode: error.statusCode,
                requestId: error.requestId
            });
            
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get metadata from a blob
     * @param {String} blobName - Name of blob
     * @returns {Object} - Metadata and properties
     */
    async getBlobMetadata(blobName) {
        try {
            console.log(`🔍 Getting metadata for: ${blobName}`);
            
            const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
            const properties = await blockBlobClient.getProperties();
            
            console.log('Retrieved metadata:', properties.metadata);
            
            return {
                success: true,
                metadata: properties.metadata || {},
                properties: {
                    contentType: properties.contentType,
                    contentLength: properties.contentLength,
                    lastModified: properties.lastModified,
                    createdOn: properties.createdOn
                }
            };
        } catch (error) {
            console.error('Get metadata error:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update metadata of an existing blob
     * @param {String} blobName - Name of blob
     * @param {Object} newMetadata - New metadata to add/update
     * @returns {Object} - Success status
     */
    async updateBlobMetadata(blobName, newMetadata) {
        try {
            console.log(`✏️ Updating metadata for: ${blobName}`);
            
            const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
            
            // Get existing metadata first
            const properties = await blockBlobClient.getProperties();
            const existingMetadata = properties.metadata || {};
            
            // Merge with new metadata
            const updatedMetadata = {
                ...existingMetadata,
                ...newMetadata,
                updatedAt: new Date().toISOString()
            };
            
            console.log('New metadata:', updatedMetadata);
            
            await blockBlobClient.setMetadata(updatedMetadata);
            
            console.log('✅ Metadata updated successfully');
            
            return {
                success: true,
                metadata: updatedMetadata
            };
        } catch (error) {
            console.error('Update metadata error:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Delete a file from blob storage
     * @param {String} blobName - Name of blob to delete
     */
    async deleteFile(blobName) {
        try {
            console.log(`🗑️ Deleting blob: ${blobName}`);
            
            const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
            await blockBlobClient.delete();
            
            console.log('✅ File deleted successfully');
            
            return { success: true };
        } catch (error) {
            console.error('Delete error:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * List all files in container with optional metadata
     */
    async listFiles(withMetadata = false) {
        try {
            console.log(`📁 Listing files in container: ${this.containerName}`);
            
            const blobs = [];
            let count = 0;
            
            for await (const blob of this.containerClient.listBlobsFlat()) {
                const blobInfo = {
                    name: blob.name,
                    url: `${this.containerClient.url}/${blob.name}`,
                    properties: {
                        contentLength: blob.properties.contentLength,
                        lastModified: blob.properties.lastModified,
                        contentType: blob.properties.contentType || 'unknown'
                    }
                };
                
                // Fetch metadata if requested
                if (withMetadata) {
                    const metadataResult = await this.getBlobMetadata(blob.name);
                    if (metadataResult.success) {
                        blobInfo.metadata = metadataResult.metadata;
                    }
                }
                
                blobs.push(blobInfo);
                count++;
            }
            
            console.log(`✅ Found ${count} files in container`);
            
            return blobs;
        } catch (error) {
            console.error('List error:', error.message);
            return [];
        }
    }

    /**
     * Get storage analytics
     */
    async getStorageAnalytics() {
        try {
            console.log('📊 Generating storage analytics...');
            
            const blobs = await this.listFiles(true);
            
            let totalSize = 0;
            const uploaders = {};
            const fileTypes = {};
            
            blobs.forEach(blob => {
                totalSize += blob.properties.contentLength || 0;
                
                // Count by uploader
                const uploader = blob.metadata?.uploadedBy || 'unknown';
                uploaders[uploader] = (uploaders[uploader] || 0) + 1;
                
                // Count by file type
                const fileType = blob.properties.contentType?.split('/')[0] || 'unknown';
                fileTypes[fileType] = (fileTypes[fileType] || 0) + 1;
            });
            
            const analytics = {
                totalFiles: blobs.length,
                totalSize: totalSize,
                totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
                totalSizeGB: (totalSize / (1024 * 1024 * 1024)).toFixed(3),
                uploaders: uploaders,
                fileTypes: fileTypes,
                recentFiles: blobs.slice(0, 5).map(b => ({
                    name: b.name,
                    size: b.properties.contentLength,
                    type: b.properties.contentType,
                    uploader: b.metadata?.uploadedBy || 'unknown'
                }))
            };
            
            console.log('✅ Analytics generated');
            
            return analytics;
        } catch (error) {
            console.error('Analytics error:', error.message);
            return null;
        }
    }
}

// Export single instance
const blobStorageInstance = new BlobStorage();
module.exports = blobStorageInstance;