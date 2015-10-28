<%@ Page language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">
    <title>Tests</title>
    <SharePoint:ScriptLink name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
	<link rel="stylesheet" type="text/css" href="spfiletree/skin-win8/ui.fancytree.css" />
    <script type="text/javascript" src='spscript.js'></script>
    <script type="text/javascript" src='splanguagepicker/splanguagepicker.jquery.js'></script>
    <script type='text/javascript' src='spfiletree/spfiletree.js'></script>
</asp:Content>

<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">
    <div id="spLanguagePicker">
        <select id="language-picker"></select>
    </div>
    
    <div id='spFileTree'>
        <ul id="treeData">
            <li id="id3" class="folder">Folder
            <ul>
                <li id="id3.1">Sub-item 3.1
                    <ul>
                        <li id="id3.1.1">Sub-item 3.1.1</li>
                        <li id="id3.1.2">Sub-item 3.1.2</li>
                    </ul>
                </li>
            </ul>
            </li>
        </ul>
    </div>
    <script>
        var picker = $("#language-picker").spLanguagePicker();

        var tree = $("#spFileTree").spFileTree({ library: "TestLibrary" });
    </script>
</asp:Content>
