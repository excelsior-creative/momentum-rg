import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  hooks: {
    afterRead: [
      ({ doc }) => {
        const blobHostname = 'https://3huuq4ro9ng8siwd.public.blob.vercel-storage.com'
        
        // Fix main URL
        if (doc.url && doc.url.startsWith('/api/media/file/')) {
          const filename = doc.filename
          if (filename) {
            doc.url = `${blobHostname}/${filename}`
          }
        }

        // Fix sizes URLs
        if (doc.sizes) {
          for (const sizeKey in doc.sizes) {
            if (doc.sizes[sizeKey].url && doc.sizes[sizeKey].url.startsWith('/api/media/file/')) {
              const sizeFilename = doc.sizes[sizeKey].filename
              if (sizeFilename) {
                doc.sizes[sizeKey].url = `${blobHostname}/${sizeFilename}`
              }
            }
          }
        }
        
        return doc
      },
    ],
  },
  access: {
    read: () => true, // Allow public read access to all media
  },
  upload: {
    staticDir: '../public/uploads',
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 512,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: undefined,
        position: 'centre',
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'textarea',
    },
  ],
}

