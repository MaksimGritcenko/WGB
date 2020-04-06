export const UPDATE_SOCIAL_LOGINS = 'UPDATE_SOCIAL_LOGINS';

/**
 * Update Social Logins
 * @param post
 */
export const updateSocialLogins = logins => ({
    type: UPDATE_SOCIAL_LOGINS,
    logins
});
