type PermissionType =
    | "photos"
    | "camera"
    | "location"
    | "contacts"
    | "reminders"
    | "music"
    | "microphone"
    | "speech-recognition"
    | "background-audio"
    | "background"
    | "bluetooth"
    | "network"
    | "calendars"
    | "faceid"
    | "siri"
    | "motion";

interface Permission {
    /**
     * The accepted permission types are the following:
     *
     * - photos
     * - camera
     * - location
     * - contacts
     * - reminders
     * - music
     * - microphone
     * - speech-recognition
     * - background-audio
     * - background-fetch
     * - bluetooth
     * - network
     * - calendars
     * - faceid
     * - siri
     * - motion
     */
    type: PermissionType;
    /** This should explain what the permission is and why your app needs it. */
    usageDescription: string;
}

interface Version {
    /**
     * This must match your application's `CFBundleShortVersionString` (located in Info.plist)
     * in order for SideStore updates to work properly.
     */
    version: string;
    /**
     * This should be the date that you are releasing your application, and should be written
     * in the format `YYYY-MM-DD` (other formats standard formats will work as well, but this
     * is the only info required and shown to the user).
     *
     * If you are planning on releasing your application in the future, after everyone has
     * installed your source, there is an additional format available: `YYYY-MM-DDTHH:MM:SS`
     *
     * Using this format will create an automatic timer countdown to the release time specified.
     * Please note that the time is automatically assumed to be UTC and uses a 24 hour clock.
     *
     * If you would rather use the time in your timezone, add `-08:00` to the end of the date,
     * where that `-08` corresponds to the number of hours difference between UTC and your timezone.
     * It is also important to note that UTC does not change with daylight saving time, so be careful
     * if you are releasing around that time of year as it can be easy to miscalculate.
     */
    date: string;
    /** Use this to tell the user what new features you introduced or what bugs you squashed with the latest version. */
    localizedDescription?: string | undefined;
    /**
     * This should point directly to wherever your IPA is hosted.
     *
     * If you are planning on releasing your app in the future, this property is still required
     * but it doesn't have to actually point to a valid file.
     */
    downloadURL: string;
    /**
     * This is an integer value that should be set equivalent to the size of your IPA in
     * bytes. This gives the user an idea of how large the application is before they install.
     */
    size: number;
    /**
     * These are used to indicate the iOS version restrictions that your app may have (inclusively).
     * It also allows you to support multiple different versions of your app that can support
     * different iOS version ranges.
     */
    minOSVersion?: string | undefined;
    /**
     * These are used to indicate the iOS version restrictions that your app may have (inclusively).
     * It also allows you to support multiple different versions of your app that can support
     * different iOS version ranges.
     */
    maxOSVersion?: string | undefined;
}

interface App {
    /** Rather self-explanatory, this is the name of your app as it should appear in the SideStore. */
    name: string;
    /**
     * SideStore uses this to separate apps as individual listings.
     *
     * This must be the same as your application's `CFBundleIdentifier` (located in
     * Info.plist) in order for SideStore to be able to open the app after installation.
     * Technically, it can be any unique string, but for all SideStore functionality to
     * work, it should be the same as the application.
     */
    bundleIdentifier: string;
    /**
     * Also self-explanatory, this is just the name of the developer/developers that
     * will appear in the SideStore app listing.
     */
    developerName: string;
    /**
     * This should be a very short description of your app that will appear in the
     * browse tab of SideStore. It should give a quick one sentence explanation of
     * your app and why a user wants it. The most effective subtitles tend to around
     * 6-10 words long.
     */
    subtitle?: string | undefined;
    /**
     * This is where you can include every feature and detail about your app. The user
     * will see the first 5 lines of text then they can click "More" to expand to the
     * full section. So you should think of the first couple sentences as a quick pitch
     * for your app.
     */
    localizedDescription: string;
    /**
     * This should point directly to wherever you host the icon for your app. Note that
     * this doesn't have to be the same as the icon used for the actual application, but
     * it is recommended to maintain consistency.
     */
    iconURL: string;
    /**
     * This might take some experimentation, but the best tint color is usually choosing
     * one of the darker colors represented in your app icon. The tint color will be used
     * in two places:
     *
     * - For the install button
     * - As a background color for the larger app listing bubble (but this will be a lighter shade)
     *
     * The tint color must be in the 6 character Hex format, with the '#' before the 6
     * characters as optional.
     */
    tintColor?: string | undefined;
    /**
     * This is to show the user what various permissions your app requires. Create an entry
     * for each separate permission your app requires.
     *
     * It is *highly* recommended to include these permissions if your app uses them as this
     * disclosure provides additional trust with the user.
     */
    permissions?: Permission[];
    /**
     * These should point directly to any number of screenshots/images that display your app's
     * functionality. The first two will be displayed under the app listing in the browse tab,
     * and the rest will be visible on the app's page.
     */
    screenshotURLs?: string[] | undefined;
    /**
     * Here you can specify whether apps should be classified as a beta application and receive
     * a special beta tag on its app listing.
     *
     * Currently, this is also tied in with the Patreon app locking system used with AltStore/Delta
     * betas. But it is not recommended to attempt to use it for this purpose since it will ultimately be changing in the future.
     */
    beta?: boolean | undefined;
    /**
     * A list containing the version(s) of your application. New with AltSource v2.0 API.
     *
     * Important note: SideStore will display the first version (with compatible min/max iOS versions)
     * in the list as the "latest" release, regardless of version or date. So keep in mind that the order
     * that versions appear must be in reverse chronological order.
     */
    versions: Version[];

    /**
     * This must match your application's `CFBundleShortVersionString` (located in Info.plist)
     * in order for SideStore updates to work properly.
     *
     * @deprecated Please use the {@link versions} property, this is just for backwards compatibility
     */
    version?: string | undefined;
    /**
     * This should be the date that you are releasing your application, and should be written
     * in the format `YYYY-MM-DD` (other formats standard formats will work as well, but this
     * is the only info required and shown to the user).
     *
     * If you are planning on releasing your application in the future, after everyone has
     * installed your source, there is an additional format available: `YYYY-MM-DDTHH:MM:SS`
     *
     * Using this format will create an automatic timer countdown to the release time specified.
     * Please note that the time is automatically assumed to be UTC and uses a 24 hour clock.
     *
     * If you would rather use the time in your timezone, add `-08:00` to the end of the date,
     * where that `-08` corresponds to the number of hours difference between UTC and your timezone.
     * It is also important to note that UTC does not change with daylight saving time, so be careful
     * if you are releasing around that time of year as it can be easy to miscalculate.
     *
     * @deprecated Please use the {@link versions} property, this is just for backwards compatibility
     */
    versionDate?: string | undefined;
    /**
     * Use this to tell the user what new features you introduced or what bugs you squashed with the latest version.
     *
     * @deprecated Please use the {@link versions} property, this is just for backwards compatibility
     */
    versionDescription?: string | undefined;
    /**
     * This should point directly to wherever your IPA is hosted.
     *
     * If you are planning on releasing your app in the future, this property is still required
     * but it doesn't have to actually point to a valid file.
     *
     * @deprecated Please use the {@link versions} property, this is just for backwards compatibility
     */
    downloadURL?: string | undefined;
    /**
     * This is an integer value that should be set equivalent to the size of your IPA in
     * bytes. This gives the user an idea of how large the application is before they install.
     *
     * @deprecated Please use the {@link versions} property, this is just for backwards compatibility
     */
    size?: number | undefined;
}

interface News {
    /** Fairly straightforward, this will be the headline for your news item. */
    title: string;
    /** This must be a unique identifier that should not be used by any other news items in SideStore. */
    identifier: string;
    /**
     * Similar to the caption for your app listing, this should be about a sentence. While there is
     * technically no limit to the caption size, no one wants a giant text blob in their news feed.
     *
     * If there is more to your news than a couple sentences can deliver, try using an image or link
     * to a website.
     */
    caption: string;
    /**
     * This date should follow the same format as {@link Version.date} for app listings: `YYYY-MM-DD`.
     *
     * Please note that the date does not currently display on any news items and neither does the time
     * (if provided). Instead, it is required for SideStore to organize the news into chronological order.
     */
    date: string;
    /**
     * This has the same function as {@link App.tintColor}. The only difference is that now it will be
     * used as the background color for your news item. Keep in mind that it does not apply to the
     * app listing if you supplied an {@link appID}. The app listing that appears below the news
     * article will use the tintColor specific to that app.
     */
    tintColor?: string | undefined;
    /**
     * This should be a direct link to any image you want to feature on your news item. The recommended
     * size for this image is 960x540 or any image with a 16:9 aspect ratio. SideStore will also take
     * whatever image you provide it with, then crop and center it to the correct aspect ratio. Be careful
     * not to put any important information in the corners since the SideStore rounds the images corners by default.
     */
    imageURL?: string | undefined;
    /**
     * This should be used to link users to a website when they click the news item. The link will open
     * in SideStore's built-in web browser (based off safari).
     */
    url?: string | undefined;
    /**
     * This must be an exact match to the `bundleIdentifier` of the app listing in order for it to work properly.
     *
     * This is required if you want an app listing to appear below the news item for quick installation.
     *
     * It also makes it so that when a user click on the news item, it will take them to the specified
     * app's page. This will be overridden if a url is also specified.
     */
    appID?: string | undefined;
    /**
     * When set to true, SideStore will send all users of the source a notification with the title of the news item.
     *
     * Note that the notification will not be instantaneous: it will occur whenever SideStore attempts a
     * background refresh (the same time that update notifications occur) and it does require users to leave
     * SideStore running in the background.
     */
    notify?: boolean | undefined;
}

/** Based on https://github.com/SideStore/SideStore-Docs/blob/master/sources.md */
export interface Source {
    /** The name of your source. This will appear in SideStore. */
    name: string;
    /**
     * This is a bundle identifier SideStore uses to keep your source separate
     * from every other source. For this reason, it is recommended to follow Apple's
     * standard for an identifier.
     *
     * It's important to note here that changing this identifier down the road will
     * have **consequences**. Users with the source already installed will suddenly have
     * conflicting identifiers with the online source and will cause an error in SideStore
     * that will require them to completely remove the source before they can add it back.
     */
    identifier: string;
    /**
     * If your user adds your Source using a URL shortener or you have the link to file
     * stored on CDN, it is recommended that you include this property. This allows
     * SideStore to save the exact link to the file which speeds up retrieval time.
     */
    sourceURL?: string | undefined;
    apps: App[];
    news?: News[] | undefined;
}
