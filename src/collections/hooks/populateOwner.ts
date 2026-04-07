import { CollectionBeforeChangeHook } from 'payload'

export const populateOwner: CollectionBeforeChangeHook = async ({ req, operation, data }) => {
    if ((operation === 'create') && req.user) {
        data.owner = req.user.id

        // Populate plan based on user's plan
        // Populate plan based on organizer's plan
        try {
            const organizers = await req.payload.find({
                collection: 'organizers',
                where: {
                    owner: { equals: req.user.id },
                },
                limit: 1,
                depth: 1,
            });

            const organizer = organizers.docs[0];
            const plan = (organizer && typeof organizer.plan === 'object') ? organizer.plan : null;

            if (plan?.isPremium === true) {
                data.plan = 'premium';
            } else {
                data.plan = 'free';
            }
        } catch (error) {
            console.error('Error populating plan in populateOwner:', error);
            data.plan = 'free';
        }

        return data
    }
    return data
}
