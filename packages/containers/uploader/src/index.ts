import express from "express";
import multer from 'multer';
import { dirname } from 'path';
import colors from 'colors';
import { writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { db } from './db.js';
const app = express();

const port = process.env.port ?? 80

const upload = multer();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/', upload.single('file'), (req, res) => {
    if (req.file) {

        if (req.body.token !== process.env.tokenUpload) return res.sendStatus(403);

        const file = req.file;
        let name = `${file.originalname}`;
        if (existsSync(`./files/${name}`)) {
            for (let i = 0; existsSync(`./files/${name}`); i++) {
                name = `${file.originalname.split('.'[0])}(${i}).${file.originalname.split('.')[1]}`;
            }
        }
        writeFileSync(`./files/${name}`, req.file.buffer);
        const _id = db.set({
            name,
            public: Boolean(req.body.public) ?? true,
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

app.get('/:name', (req, res) => {
    const name = req.path.split('/')[1];
    const { id, view } = req.query;

    const file = db.getItemByKn('name', name);

    if (!file || (!file.public && file._id !== id)) return res.sendStatus(404);

    if (file.type === 'image' || view === 'true') {
        res.sendFile(`./files/${name}`, { root: dirname('') });
    } else {
        res.download(`./files/${name}`);
    }
});

app.delete('/delete', (req, res) => {
    const { token, name, id } = req.body;

    if (token !== process.env.tokenDelete) return res.sendStatus(403);


    const file = db.getItem(id);


    if (!file || (file.name !== name)) return res.sendStatus(404);


    unlinkSync(`./files/${file.name}`);

    db.removeItem(file._id);

    res.json({
        'ok': true,
        'body': {},
        'massage': 'delete file successful'
    });
})


app.listen(port, () => {
    if (!existsSync('./files')) mkdirSync('./files');

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