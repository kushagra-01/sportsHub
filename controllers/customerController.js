const Customer = require('../models/Customer');

exports.createCustomer = async (req, res) => {
    try {
        const { name, email } = req.body;

        // Check if customer already exists
        let customer = await Customer.findOne({ email });

        if (!customer) {
            // If customer doesn't exist, create a new one
            customer = new Customer({ name, email });
            await customer.save();
        }

        res.status(200).json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
