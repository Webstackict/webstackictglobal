export default function robots() {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/dashboard/", "/account-settings/"],
        },
        sitemap: "https://webstackict.com/sitemap.xml",
    };
}
