import { Meteor } from 'meteor/meteor';
import { JF } from 'meteor/jf:core';

// Throw error if there is no user logged in
JF.user.validate = () => {
    if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
    }
};

// Get the persistent data by key
JF.user.getData = key => {
    // Check if there is an user logged in
    // JF.user.validate();

    // Get the user object
    const user = Meteor.user();

    // Get user profile data
    const profile = user && user.profile;

    // Get the user persistent data
    const data = profile && profile.persistent;

    let result = data;
    const keys = key.split('.');
    keys.forEach(key => {
        if (typeof result !== 'object' || !result) return;
        result = result[key];
    });

    return result;
};

// Store the persistent data by giving a key and a value to store
JF.user.setData = (key, value) => {
    return new Promise((resolve, reject) => {
        try {
            // Check if there is an user logged in
            JF.user.validate();
        } catch(error) {
            reject(error);
        }

        // Call the update method on server-side
        Meteor.call('jf.user.data.set', key, value, error => {
            if (error) {
                reject(error);
            }

            resolve();
        });
    });
};
