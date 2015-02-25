<%@ Page language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">
    <SharePoint:ScriptLink name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
	<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/mocha/2.1.0/mocha.min.css">
	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
    <script type="text/javascript" src='https://cdnjs.cloudflare.com/ajax/libs/mocha/2.1.0/mocha.min.js'></script>
	<script type="text/javascript" src='https://cdnjs.cloudflare.com/ajax/libs/chai/2.1.0/chai.js'></script>
    <script type="text/javascript" src='spscript.js'></script>
</asp:Content>

<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">
    <WebPartPages:WebPartZone runat="server" FrameType="TitleBarOnly" ID="full" Title="loc:full" />
    <div id='mocha'></div>
    <script type="text/javascript"src='test.js'></script>
</asp:Content>
