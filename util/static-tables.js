const Item = require('../models/Item');

class StaticTables {
    instancePromise;
    instance = null;

    async init() {
        this.instancePromise = this.instancePromise || (async () => {
            console.log(`aquired static tables from the database`);
            this.itemTable = await Item.find({}, { _id: 1, sellPrice: 1 });
            this.itemTable = this.itemTable.map(item => { return { _id: item._id.toString(), sellPrice: item.sellPrice } });
            this.lootTable = await Item.find({ typeId: 2 }, { _id: 1 });
            this.lootTable = this.lootTable.map(a => a._id);
            return this;
        })();
        this.instance = await this.instancePromise;
        return this.instance;
    }

    get initialized() {
        if(!this.instance){
            return this.init().then(() => this);
        }
        return this.instance;
    }
}

module.exports = new StaticTables;