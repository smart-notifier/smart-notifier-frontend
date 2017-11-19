const apiRoutes = {
    feeds: {
        rss: "api/feeds/rss/"
    },
    invoices: {
        index: "invoices",
        show: "invoices/{id}",
        store: "invoices",
        update: "invoices/{id}",
        delete: "invoices/{id}",
    },
    recipients: {
        index: "invoice-recipients",
        show: "invoice-recipients/{id}",
        store: "invoice-recipients",
        update: "invoice-recipients/{id}",
        delete: "invoice-recipients/{id}",
    },
    invoiceItems: {
        index: "invoice-items",
        show: "invoice-items/{id}",
        store: "invoice-items",
        update: "invoice-items/{id}",
        delete: "invoice-items/{id}",
    }
};

const routes = {
    root: "/",
    notificationsBoard: "/notifications-board",
    invoices: {
        list: "/invoices/list",
        create: "/invoices/create",
        edit: "/invoices/edit/:id",
    }
};

const config = {
    apiBase: "http://127.0.0.1:8000/api/",
    titles: {
        default: "Smart Notifier",
        invoices: {
            list: "Invoice List",
            create: "New Invoice",
            edit: "Editing Invoice #{:number}",
        }
    },
    intervals: {
        notificationsRefresher: 5000,
        newItemsTitleBlinker: 2000
    },
    feeds: {
        maxTrailSize: 100, //how many items to keep in memory
        requestOptions: {
            upwork: "upwork/verified_payment_only=1&proposals=0-4%2C5-9&q=NOT+SEO+NOT+design+NOT+Joomla+NOT+magento+NOT+shopify+NOT+python+NOT+Ruby+NOT+Rails+NOT+wordpress+NOT+Django+NOT+india+NOT+pakistan&subcategory2=ecommerce_development%2Cweb_development%2Cother_software_development&sort=renew_time_int+desc&api_params=1&securityToken=2081e4dbfefc0d2786a953c13cf4e5b4c124e159f71397edad32c631473cfa8a3e05213c92fc3475b681fa206ffc41ce1c03e28c652e2abd94279da9fb7ee0f0&userUid=867689921303527424&orgUid=867689921341276161",
            guruCom: "guru-com/c/web-software-it/show/verified/"
        }
    },
    platforms: {
        upwork: "upwork",
        guruCom: "guruCom"
    }
};

export default Object.assign(config, {routes, apiRoutes});