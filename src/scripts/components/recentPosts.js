const selectors = {
  main: '.page__main',
  recentPostsRef: '[recent-posts-ref]',
  postTileHeight: '[data-post-tile-height]',
  postTileContainerHeight: '[data-post-tile-container-height]',
  postTileTextOverlay: '[data-post-tile-text-overlay]',
  postTileVotesPercentage: '[data-votes-percentage]',
  postTileSkeleton: '[data-post-tile-skeleton]',
  pollTypePost: '[data-post-type="Poll"]',
  postNone: '[data-posts="none"]',
}

const getCookies = () => {
  return document.cookie.split('; ').reduce((cookies, cookie) => {
    const [name, value] = cookie.split('=');
    cookies[name] = value;

    return cookies;
  }, {});
}

const sectionFetch = (accessTokenRefreshedAt, accessToken, refreshToken, sectionKey, section) => {
  const domain = window.location.origin;
  const headers = new Headers();

  headers.append('access_token_refreshed_at', accessTokenRefreshedAt);
  headers.append('access_token', accessToken);
  headers.append('refresh_token', refreshToken);

  const url = domain + '/sections/' + sectionKey;
  const options = {
    method: 'GET',
    headers: headers,
  };

  return new Promise(async (resolve, reject) => {
    await fetch(url, options)
      .then(response => {
        if (!response.ok)
          throw new Error("Request failed");

        return response.text();
      })
      .then(data => {
        if (!data.includes("This website is coming soon")) {
          section.outerHTML = data;
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

const checkDesignMode = (index, request_design_mode) => {
  const recentPostsRef = document.querySelectorAll(selectors.recentPostsRef);
  const postNone = recentPostsRef[index].querySelector(selectors.postNone)

  if (request_design_mode && postNone) {
    postNone.classList.remove('hidden');
  }
}

const continueReading = (index) => {
  const recentPostsRef = document.querySelectorAll(selectors.recentPostsRef);
  const postTiles = recentPostsRef[index].querySelectorAll(selectors.postTileHeight);

  if (postTiles) {
    postTiles.forEach(elem => {
      const postTileContainer = elem.querySelector(selectors.postTileContainerHeight);

      if (postTileContainer) {
        const postTileTextOverlay = postTileContainer.querySelector(selectors.postTileTextOverlay);

        if (postTileTextOverlay && postTileContainer.clientHeight > elem.clientHeight) {
          postTileTextOverlay.classList.remove("hidden");
        } else if (postTileTextOverlay) {
          postTileTextOverlay.classList.add("hidden");
        }
      }
    });
  }
}
const votesPercentage = (index) => {
  const recentPostsRef = document.querySelectorAll(selectors.recentPostsRef);
  const pollTypePost = recentPostsRef[index].querySelectorAll(selectors.pollTypePost);

  if (pollTypePost.length > 0) {
    pollTypePost.forEach(poll => {
      const votesPercentage = poll.querySelectorAll(selectors.postTileVotesPercentage);
      let winningOption;
      let winningBar;
      let prevPercentage = 0;

      if (votesPercentage.length > 0) {
        votesPercentage.forEach(elem => {
          const percentage = elem.dataset.votesPercentage;
          const bar = elem.nextElementSibling;

          if (percentage > prevPercentage) {
            prevPercentage = percentage;
            winningOption = elem.parentElement;
            winningBar = bar;
          }

          bar.style.width = percentage + "%";
        });

        if (winningOption && winningBar) {
          winningOption.classList.add("post-tile__option--winning");
          winningBar.classList.add("post-tile__option-bar--winning");
        }
      }
    });
  }
}

const removeSkeleton = (index) => {
  const recentPostsRef = document.querySelectorAll(selectors.recentPostsRef);
  const postTileSkeleton = recentPostsRef[index].querySelectorAll(selectors.postTileSkeleton);

  if (postTileSkeleton.length > 0) {
    postTileSkeleton.forEach(elem => {
      elem.remove();
    });
  }
}

export const recentPosts = () => {
  const main = document.querySelector(selectors.main);

  if (!main) return;

  const recentPostsRef = document.querySelectorAll(selectors.recentPostsRef);
  const request_design_mode = typeof design_mode !== 'undefined' ? design_mode : null;

  for (let i = 0; i < recentPostsRef.length; i++) {
    const allCookies = getCookies();
    const section = recentPostsRef[i].parentElement;
    const sectionKey = recentPostsRef[i].parentElement.id.replace("fw-section-", "");

    sectionFetch(allCookies.access_token_refreshed_at, allCookies.access_token, allCookies.refresh_token, sectionKey, section)
      .then(state => {
        if (state) {
          removeSkeleton(i);
          checkDesignMode(i, request_design_mode);
          continueReading(i);
          votesPercentage(i);
          window.addEventListener("resize", continueReading(i));
        }
      })
      .catch(error => {
        console.error("Error: ", error);
      });
  }
}