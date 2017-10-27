const paths = {
    root: "/",
    notificationsBoard: "/notifications-board",
    feeds: {
        upwork: "api/feeds/rss/upwork/verified_payment_only=1&proposals=0-4%2C5-9&q=NOT+SEO+NOT+design+NOT+Joomla+NOT+magento+NOT+shopify+NOT+python+NOT+Ruby+NOT+Rails+NOT+wordpress+NOT+Django+NOT+india+NOT+pakistan&subcategory2=ecommerce_development%2Cweb_development%2Cother_software_development&sort=renew_time_int+desc&api_params=1&securityToken=2081e4dbfefc0d2786a953c13cf4e5b4c124e159f71397edad32c631473cfa8a3e05213c92fc3475b681fa206ffc41ce1c03e28c652e2abd94279da9fb7ee0f0&userUid=867689921303527424&orgUid=867689921341276161"
    }
};

const config = {
    apiBase: "http://127.0.0.1:8000/",
    intervals: {
        notificationsRefresher: 30000
    }
};

export default Object.assign(config, {paths});