import { db_unRejester } from '../db_unrejster.ts';
import { db_rejestered } from '../db_rejestered.ts';

export const rejester =  (_id: string, group: string, _private: boolean, level: number) => {

    // get record
    const record = db_unRejester.getItem(_id);

    if (!record) throw new Error('Not Found Record');

    // write file
    try {

        // set info record in db
        db_rejestered.set({
            path: record.filename,
            group,
            _private,
            type: record.contentType,
            level,
            private: false
        });

        // Remove to db unRejester
        if (record._id) db_unRejester.removeItem(record._id);

        return record.filename;

    } catch (error) {
        console.error(error);
        throw error;
    }
}