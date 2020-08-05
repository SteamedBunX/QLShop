const Item = require('../models/Item');
const Shop = require('../models/Shop');

class StaticTables {
    instancePromise;
    instance = null;

    async init() {
        this.instancePromise = this.instancePromise || (async () => {
            console.log(`aquiring static tables from the database`);
            await this.loadItemTable();
            await this.loadLootTable();
            await this.loadShops();
            return this;
        })();
        this.instance = await this.instancePromise;
        return this.instance;
    }

    async loadShops() {
        this.shops = await Shop.find();
    }

    async loadItemTable() {
        this.itemTable = await Item.find({}, { _id: 1, sellPrice: 1 });
        this.itemTable = this.itemTable.map(item => { return { _id: item._id.toString(), sellPrice: item.sellPrice } });
    }

    async loadLootTable() {
        this.lootTable = await Item.find({ typeId: 2 }, { _id: 1 });
        this.lootTable = this.lootTable.map(a => a._id);
    }

    get initialized() {
        if(!this.instance){
            return this.init().then(console.log('Static Database Initialized')).then(() => this);
        }
        return this.instance;
    }
}

module.exports = new StaticTables;