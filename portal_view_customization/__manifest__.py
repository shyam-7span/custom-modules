{
    "name": "portal_view_customization",
    "summary": "Portal Customization",
    "description": "",
    "license": "LGPL-3",
    "author": "7Span",
    "website": "https://www.7span.com",
    "category": "Customizations",
    "version": "17.0.1.0.0",
    "depends": ["base", "sale_management", "portal"],
    "data": [
        "views/sale_order_views.xml",
        "report/sale_quotation_customization.xml",
    ],
    "assets": {
        "web.assets_frontend": [
            (
                "replace",
                "portal/static/src/signature_form/signature_form.js",
                "portal_view_customization/static/src/terms_check/terms_check.js",
            ),
            "portal_view_customization/static/src/terms_check/terms_check.xml",
        ],
    },
}
