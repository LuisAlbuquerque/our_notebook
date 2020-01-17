const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

module.export = {
    dest : path.resolve(__dirname, '..', '..', 'public', 'uploads'),
    storage : multer.diskStorage({
        //destination : (req,file,cb) => {
        //    cb(null,path.resolve(__dirname, '..', '..', 'public', 'uploads'));
        //},
        filename : (req,file,cb) => {
            crypto.ramdomBytes(16,(err,hash) => {
                if(err) cb(err);
            });
            const fileName = `${hash.toString('hex')}-${file.originalname}`;
            cb(null,fileName);
        }
    }),
    //limits : { },
    //fileFilter : (req,file,cb) => { cb(null,true); } 

}
