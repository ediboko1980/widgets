

const v1PopupTemplate = ` 
<div class="crt-popup"> 
    <a href="#" class="crt-close crt-icon-cancel"></a> 
    <a href="#" class="crt-next crt-icon-right-open"></a> 
    <a href="#" class="crt-previous crt-icon-left-open"></a> 
    <div class="crt-popup-left">  
        <div class="crt-video"> 
            <div class="crt-video-container">
                <video preload="none">
                <source src="<%=video%>" type="video/mp4">
                </video>
                <img src="<%=image%>" alt="Image posted by <%=user_screen_name%> to <%=this.networkName()%>" />
                <a href="javascript:;" class="crt-play"><i class="crt-play-icon"></i></a> 
            </div> 
        </div> 
        <div class="crt-image"> 
            <img src="<%=image%>" alt="Image posted by <%=user_screen_name%> to <%=this.networkName()%>" /> 
        </div> 
        <div class="crt-pagination"><ul></ul></div>
    </div> 
    <div class="crt-popup-right"> 
        <div class="crt-popup-header"> 
            <span class="crt-social-icon"><i class="crt-icon-<%=this.networkIcon()%>"></i></span> 
            <img src="<%=user_image%>" alt="Profile image for <%=user_full_name%>"  /> 
            <div class="crt-post-name"><span><%=user_full_name%></span><br/><a href="<%=this.userUrl()%>" target="_blank">@<%=user_screen_name%></a></div> 
        </div> 
        <div class="crt-popup-text <%=this.contentTextClasses()%>"> 
            <div class="crt-popup-text-container"> 
                <p class="crt-date"><%=this.prettyDate(source_created_at)%></p> 
                <a class="crt-link" href="<%= this.networkIcon() == "facebook" ? url :"" %>" target="_blank"><%= this.networkIcon() == "facebook" ? "Go to post" :"" %></a>
                <div class="crt-popup-text-body"><%=this.parseText(text)%></div> 
            </div> 
        </div> 
        <div class="crt-popup-read-more">
            <a href="#" class="crt-post-read-more-button"><%=this._t("read-more")%></a> 
        </div>
        <div class="crt-popup-footer">
            <div class="crt-popup-stats"><span><%=likes%></span> <%=this._t("likes", likes)%> <i class="sep"></i> <span><%=comments%></span> <%=this._t("comments", comments)%></div> 
            <div class="crt-post-share"><span class="ctr-share-hint"></span><a href="#" class="crt-share-facebook"><i class="crt-icon-facebook"></i></a>  <a href="#" class="crt-share-twitter"><i class="crt-icon-twitter"></i></a></div>
        </div> 
    </div> 
</div>`;

export default v1PopupTemplate;