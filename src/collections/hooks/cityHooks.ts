import { CollectionBeforeChangeHook } from 'payload';

export const getOrCreateCity: CollectionBeforeChangeHook = async ({
    data,
    operation,
}) => {
    if (operation === 'create' || operation === 'update') {

        // If city is already an ID (relationship), we assume it's valid
        // But if it comes as a string (from a form that allows free text, or import), we need to handle it
        // Note: In Payload relationship fields, if the input is a string that is NOT an ID, validation might fail before this hook if we don't handle it carefully.
        // However, we are likely going to keep 'city' as a relationship field. 
        // If we want to support "type a name and it becomes a relation", we might need a separate field for input or handle it in specific API endpoints/actions.

        // BETTER APPROACH for Payload Admin UI: 
        // Payload's relationship field doesn't support "create on the fly" natively in the best way for a simple string input without custom UI.
        // For the public forms (Frontend), we will handle "get or create" in the Server Action.

        // This hook might be useful if we want to sync normalized city names or generate a slug for a separate text field.

        // BUT, the user request says: "musi mieć możliwość wpisania własnego".
        // In the frontend forms, we can send a string. The Server Action should look it up or create it.

        // If we want to use this hook to intercept a "string" being passed to a relationship field, Payload might error out on validation before this hook runs if the type doesn't match.
        // So standard practice is: Frontend sends string -> Server Action finds/creates City -> Server Action passes City ID to Payload 'create'/'update'.

        // So actually, this logic belongs in a UTILITY function used by Server Actions and Seed Scripts, rather than a Payload Hook, 
        // unless we use a separate "cityName" field and move it to the relationship in `beforeChange`.

        // Let's create it as a utility function first.
    }
    return data;
};
