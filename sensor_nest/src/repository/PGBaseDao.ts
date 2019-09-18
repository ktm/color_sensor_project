import {db} from 'pg-client';
import { connectionString } from '../config';

export class PGBaseDao {

  protected query(sql: string) {
    db.connect(connectionString, async ({ query }) => {
      const result = await query(sql);
      if (result.rowCount) {
        result.rows[0];
      }
      });
    }
}
