import express from "express";
import multer from 'multer';
import { dirname } from 'path';
import colors from 'colors';
import cors from 'cors';
import { writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { db } from './db.js';
const app = express();

const port = process.env.port ?? 1200;
const path = process.env.path ?? './files'

const upload = multer();

app.use(express.json());
app.use(express.urlencoded());

app.use(cors({
    origin: '*'
}));

app.post('/api/uploader/', upload.single('file'), (req, res) => {
    if (req.file) {

        if (req.body.token !== process.env.tokenUpload) return res.sendStatus(403);


        const file = req.file;
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        let name = `${file.originalname}`;
        if (existsSync(`${path}/${name}`)) {
            for (let i = 0; existsSync(`${path}/${name}`); i++) {
                const formatArray = req.file.originalname.split('.');
                const format = formatArray[formatArray.length-1]
                const newName = file.originalname.replace(`.${format}`,`(${i}).${format}`);
                name = newName;
            }
        }
        writeFileSync(`${path}/${name}`, req.file.buffer);
        const _id = db.set({
            name,
            public: req.body.public === 'false' ? false : true,
            type: file.mimetype.split('/')[0]
        })
        res.json({
            'ok': true,
            'body': {
                'id': _id._id,
                'name': _id.name
            },
            'massage': 'upload file successful'
        });
    }

});

app.get('/api/uploader', (req, res) => {
    const { id, view , name} = req.query;

    const file = db.getItemByKn('name', name as string);


    if (!file || (!file.public && file._id !== id)) return res.sendStatus(404);

    if (file.type === 'image' || view === 'true') {
        res.sendFile(`${path}/${name}`, { root: dirname('') });
    } else {
        res.download(`${path}/${name}`);
    }
});

app.post('/api/uploader/delete', (req, res) => {
    const { token, name } = req.body;

    if (token !== process.env.tokenDelete) return res.sendStatus(403);

    const file = db.getItemByKn('name',name);

    if (!file) return res.json('not exit file')

    unlinkSync(`${path}/${file.name}`);

    db.removeItem(file._id);

    res.json({
        'ok': true,
        'body': {},
        'massage': 'delete file successful'
    });
})


app.listen(port, () => {
    if (!existsSync(path)) mkdirSync(path);

    console.log(colors.yellow(' -------------------'))
    console.log(colors.yellow('| '),colors.bgBlue('Novin Uploader'),colors.yellow(' |'));
    console.log(colors.yellow(' -------------------'))
    console.log(colors.cyan('Port:'), colors.green(String(port)));
    console.log(colors.cyan('Files:'), colors.green(String(db.getAll.length)));
    console.log(colors.cyan('Token Upload:'), process.env.tokenUpload ? colors.green('ok') : colors.red('The token is not set'));
    console.log(colors.cyan('Token Delete:'), process.env.tokenDelete ? colors.green('ok') : colors.red('The token is not set'));
    console.log(colors.cyan('Status:'), colors.green('OK'));
    console.log(colors.yellow('-------------------'))
});