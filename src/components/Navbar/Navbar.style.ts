import {
    container,
    defaultFont,
    primaryColor,
    defaultBoxShadow,
    infoColor,
    successColor,
    warningColor,
    dangerColor,
    whiteColor,
    grayColor,
    blackColor
} from "../material.jss";

const navBtnIcons = { '& .btn-icon': {
    margin: "0 5px 2px 0 !important"
}}

const navBtns = {
    '& .nav-btn': {
        ...navBtnIcons,
        color: 'rgb(85, 85, 85)',
        "&:focus,&:hover,&:visited": {
            color: "#8c209e"
        }
    },
    '& .active': {
        color: "#8c209e"
    }
}

const headerStyle = () => ({
    appBar: {
        backgroundColor: blackColor,
        borderBottom: "0",
        marginBottom: "0",
        width: "100%",
        paddingTop: "10px",
        zIndex: "1029",
        color: grayColor[7],
        border: "0",
        padding: "10px 0",
        transition: "all 150ms ease 0s",
        minHeight: "50px",
        display: "block",
        ...navBtns
    },
    appDrawer: {
        ...navBtns,
        '& .nav-btn': {
            ...navBtns["& .nav-btn"],
            minWidth: 230,
            minHeight: 50,
            fontSize: 15,
            borderBottom: 'solid 1px rgba(85, 85, 85, 0.2)',
            borderRadius: 0
        }
    },
    container: {
        ...container,
        minHeight: "50px"
    },
    flex: {
        flex: 1
    },
    title: {
        ...defaultFont,
        letterSpacing: "unset",
        lineHeight: "30px",
        fontSize: "18px",
        borderRadius: "3px",
        textTransform: "none",
        color: "inherit",
        margin: "0",
        "&:hover,&:focus": {
        background: "transparent"
        }
    },
    primary: {
        backgroundColor: primaryColor[0],
        color: whiteColor,
        ...defaultBoxShadow
    },
    info: {
        backgroundColor: infoColor[0],
        color: whiteColor,
        ...defaultBoxShadow
    },
    success: {
        backgroundColor: successColor[0],
        color: whiteColor,
        ...defaultBoxShadow
    },
    warning: {
        backgroundColor: warningColor[0],
        color: whiteColor,
        ...defaultBoxShadow
    },
    danger: {
        backgroundColor: dangerColor[0],
        color: whiteColor,
        ...defaultBoxShadow
    },
    dark: {
        backgroundColor: blackColor,
        color: whiteColor,
        ...defaultBoxShadow
    }
});

export default headerStyle;
