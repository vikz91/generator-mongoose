<!DOCTYPE html>
<html>

<head>
    <title></title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style type="text/css">
        /* CLIENT-SPECIFIC STYLES */

        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        /* Prevent WebKit and Windows mobile changing default text sizes */

        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        /* Remove spacing between tables in Outlook 2007 and up */

        img {
            -ms-interpolation-mode: bicubic;
        }
        /* Allow smoother rendering of resized image in Internet Explorer */
        /* RESET STYLES */

        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        table {
            border-collapse: collapse !important;
        }

        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
        }
        /* iOS BLUE LINKS */

        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }
        /* MOBILE STYLES */

        @media screen and (max-width: 525px) {
            /* ALLOWS FOR FLUID TABLES */
            .wrapper {
                width: 100% !important;
                max-width: 100% !important;
            }
            /* ADJUSTS LAYOUT OF LOGO IMAGE */
            .logo img {
                margin: 0 auto !important;
            }
            /* USE THESE CLASSES TO HIDE CONTENT ON MOBILE */
            .mobile-hide {
                display: none !important;
            }
            .img-max {
                max-width: 100% !important;
                width: 100% !important;
                height: auto !important;
            }
            /* FULL-WIDTH TABLES */
            .responsive-table {
                width: 100% !important;
            }
            /* UTILITY CLASSES FOR ADJUSTING PADDING ON MOBILE */
            .padding {
                padding: 10px 5% 15px 5% !important;
            }
            .padding-meta {
                padding: 30px 5% 0px 5% !important;
                text-align: center;
            }
            .no-padding {
                padding: 0 !important;
            }
            .section-padding {
                padding: 1px 15px 1px 15px !important;
            }
            /* ADJUST BUTTONS ON MOBILE */
            .mobile-button-container {
                margin: 0 auto;
                width: 100% !important;
            }
            .mobile-button {
                padding: 15px !important;
                border: 0 !important;
                font-size: 16px !important;
                display: block !important;
            }
        }
        /* ANDROID CENTER FIX */

        div[style*="margin: 16px 0;"] {
            margin: 0 !important;
        }
    </style>
</head>

<body style="margin: 0 !important; padding: 0 !important;">
    <!-- HIDDEN PREHEADER TEXT -->
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        Sample Subject Body
    </div>
    <!-- HEADER -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td bgcolor="#ffffff" align="center">
                <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellspacing="0" cellpadding="0" width="500">
            <tr>
            <td align="center" valign="top" width="500">
            <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px;" class="wrapper">
                    <tr>
                        <td align="center" valign="top" style="padding: 15px 0;" class="logo">
                            <a href="http://www.domain.com" target="_blank">
                                <img alt="Logo" src="http://via.placeholder.com/350x150" width="auto" height="auto" style="display: block; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-size: 16px;" border="0">
                            </a>
                        </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
            </td>
        </tr>
        <tr>
            <td bgcolor="#ffffff" align="center" style="padding: 5px 15px 5px 15px;" class="section-padding">
                <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellspacing="0" cellpadding="0" width="500">
            <tr>
            <td align="center" valign="top" width="500">
            <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px;" class="responsive-table">
                    <tr>
                        <td>
                            <!-- HERO IMAGE -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
        
                                <tr>
                                    <td>
                                        <!-- COPY -->
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td align="left" style="font-size: 25px; font-family: Helvetica, Arial, sans-serif; color: #333333; padding-top: 30px;" class="padding">Hello {{userName}},</td>
                                            </tr>
                                            <tr>
                                                <td align="justify" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Helvetica, Arial, sans-serif; color: #666666;"
                                                    class="padding">
                                                    Thank you for choosing domain. 
                                                    Here is your login details : <br/>
                                                    <div style="font-family:'Times New Roman', Times, serif">
                                                        Username : {{email}} <br />
                                                        Password : {{password}}
                                                    </div>
                                                    You can also bookmark the url link for quicker access.
                                                    <br>
                                                    <br>
                                                    <div style="border-radius: 3px; background-color: #ff2752;">
                                                        <a class="mobile-button" 
                                                            style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; text-align: center; border-radius: 3px; padding: 15px 25px; border: 1px solid #FFFFFF; display: block;"
                                                            href="http://domain.com/#!/profile">
                                                            Explore More
                                                        </a>
                                                    </div>
                                                    <br/>
                                                    <br/>
                                                    <br/> Regards,
                                                    <br/>The domain Team
                                                    <br/>
                                                    <br/></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
            </td>
        </tr>
        <tr>
            <td bgcolor="#363636" align="center" style="padding: 70px 15px 70px 15px;" class="section-padding">
                <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellspacing="0" cellpadding="0" width="500">
            <tr>
            <td align="center" valign="top" width="500">
            <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px;" class="responsive-table">
                    <tr>
                        <td>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center" style="font-size: 25px; font-family: Helvetica, Arial, sans-serif; color: #F5F7FA;" class="padding">Connect With Us</td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0 20px 0; font-size: 15px; color: #f1f1f1; font-weight: normal; font-family: Georgia, Times, serif; line-height: 26px; vertical-align: top; text-align: center;"
                                        valign="top" class="padding">
                                        <a href="http://www.facebook.com/domain" target="_blank"><img title="Facebook" src="https://www.emailonacid.com/images/emails/5_13/footer_fb.gif" alt="Facebook" width="42" height="42" border="0" /></a>
                                        <a href="http://twitter.com/domain" target="_blank"><img title="Twitter" src="https://www.emailonacid.com/images/emails/5_13/footer_twitter.gif" alt="Twitter" width="42" height="42" border="0" /></a>
                                        <br /> <a style="text-decoration: none; color: #F5F7FA; font-weight: normal;" href="http://www.domain.com"
                                            target="_blank">+91-9686-857-236</a>
                                        <br /><a style="text-decoration: none; color: #F5F7FA; font-weight: normal;" href="http://www.domain.com"
                                            target="_blank">+91-9740-897-329</a>
                                        <br /><a style="text-decoration: none; color: #F5F7FA; font-weight: normal;" href="http://www.domain.com"
                                            target="_blank">hello@domain.com</a></td>
                                </tr>
                                <tr>
                                    <td align="center" style="font-size: 12px; line-height: 18px; font-family: Helvetica, Arial, sans-serif; color:#848484;">
                                        domain Design Solutions Pvt Ltd
                                        <br/> #549, 1st Floor, 14th Main Road, Sector 7
                                        <br/> HSR Layout, Bengaluru - 560102
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>