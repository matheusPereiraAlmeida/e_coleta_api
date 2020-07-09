import knex from '../database/connection';
import {Request, Response} from 'express'

class pointsController {

    async create (request: Request, response: Response)  {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf, 
            items
        } = request.body;
        
        //const trx = await knex.transaction();
        
        const ids = await knex('points').insert({
            image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name: name,
            email: email,
            whatsapp: whatsapp,
            latitude: latitude,
            longitude: longitude,
            city: city,
            uf: uf
        });
    
        const pointItems = items.map((item_id: number) => {
            return {
                item_id,
                point_id: ids[0],
            };
        });
    
        await knex('point_items').insert(pointItems);
    
        return response.json({ sucess: true });
    };
    
    async show (request: Request, response: Response) {
        const id = request.params.id;
        console.log("Id: "+ id);
        const point = await knex('points').where('id', id).first();
        console.log("points: "+ point);
        if(!point){
            return response.status(400).json({ message: 'Point not found'});
        }

        const items = await knex('items')
        .join('point_items', 'items.id','=','point_items.item_id')
        .where('point_items.point_id', id)
        console.log("Items: "+ items);

        return response.json({point, items});
    }

    async index (request: Request, response: Response) {
        const { city, uf, items } = request.query;
        const parsedItems = String(items).split(',')
        .map(item => Number(item.trim()));

        const points = await knex('points')
        .join('point_items', 'points.id', '=', 'point_items.point_id')
        .whereIn('point_items.item_id', parsedItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*');

        return response.json(points);
    }
}

export default pointsController;