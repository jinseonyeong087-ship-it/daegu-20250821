 const btn = document.getElementById("img-btn");

    // 기본 스타일 설정
    btn.style.width = "200px";
    btn.style.height = "100px";
    btn.style.backgroundImage = "url('./images/amieskake.png')";
    btn.style.backgroundSize = "cover";
    btn.style.backgroundPosition = "center";
    btn.style.border = "none";
    btn.style.color = "white";
    btn.style.fontSize = "18px";
    btn.style.cursor = "pointer";
    btn.style.transition = "0.3s";

    // 마우스 올렸을 때 (hover)
    btn.addEventListener("mouseover", () => {
      btn.style.backgroundImage = "url('./images/btn-hover aprikosmos.png')";
      btn.style.transform = "scale(1.05)";
    });

    // 마우스 뗐을 때
    btn.addEventListener("mouseout", () => {
      btn.style.backgroundImage = "url('./images/amieskake.png')";
      btn.style.transform = "scale(1)";
    });