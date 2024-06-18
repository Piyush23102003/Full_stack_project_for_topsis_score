import { v2 as cloudinary } from 'cloudinary';
function upload_file(file_path,id){


    
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET 
    });
    
    return cloudinary.uploader.upload(file_path,{ resource_type: "raw",public_id:id })
    .then(uploadResult => {
      console.log("Upload successful:", uploadResult);
      
      return uploadResult; 
    })
    .catch(error => {
      console.error("Upload failed:", error);
      
      throw error; 
    });
    
}

export {upload_file}