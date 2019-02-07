module.exports = {
    dragonTreasure: async (req, res) => {
        const db = req.app.get('db')
        const treasure = await db.get_dragon_treasure(1)

        return res.send(treasure)
    },
    getMyTreasure: async (req, res) => {
        const db = req.app.get('db')
        const { id } = req.session.user
        const treasure = await db.get_my_treasure(id)

        res.send(treasure)
    },
    getAllTreasure: async (req, res) => {
        const db = req.app.get('db')
        const treasure = await db.get_all_treasure()

        return res.send(treasure)
    },
    addMyTreasure: async (req, res) => {
        const db = req.app.get('db')
        const { treasureURL } = req.body
        const { id } = req.session.user

        const treasure = await db.add_user_treasure(treasureURL, id)

        return res.status(200).send(treasure)
    }
}