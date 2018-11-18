const   GITHUB_URL = "https://github.com";
const   GITHUB_API_URL = "https://api.github.com";


///////////////////////////////////////////////////////////
//  _execFetch()
//
//  Executes a fetch(fetch_url) - will call the specified
//  callback, passing the results (json) on success.
//
//  Throws an Error objct on failure.
//    
			function execFetch(fetch_url, callback) {
				fetch(fetch_url).then(response => {
					return response.json();
				}).then(json_data => {
					if (typeof(callback) === "function")
						callback(json_data);
				}).catch(error_msg => {
					throw new Error(error_msg);
				});
			}

			function fetchRepos(git_user, callback) {
				if (typeof(git_user) !== "string" || typeof(callback) !== "function")
					return false;
					
				let api_fetch_all = `${GITHUB_API_URL}/users/${git_user}/repos`;
				
				function _callback(json_data) {
					callback(json_data);
				}

				execFetch(api_fetch_all, _callback);

				return true;
			}


			function fetchRepoJSON(git_user, git_repo, callback) {
				if (
					typeof(git_user) !== "string" ||
					typeof(git_repo) !== "string" ||
					typeof(callback) !== "function"
				) return false;

				let api_fetch_repo = `${GITHUB_API_URL}/repos/${git_user}/${git_repo}`;
			
				function _callback(json_data) {
					callback(json_data);
				}

				execFetch(api_fetch_repo, _callback);

				return true;
			}
    

            function initSubmit(user_id) {
                if (user_id !== "")
                git_user = user_id;
            }

            function showJSONObject(el, repo_json, margin) {
                console.log("JSON KEYS...");
                var json_keys = Object.keys(repo_json);

                console.log("showJSONObject()\n\n");
                json_keys.forEach((key, index) => {
                    if (! index)
                        el.innerHTML += `<p class="modal-inner-token" style="margin-left: ${margin - 16}px;">{</p><br/>`;
                    else
                        el.innerHTML += `<p class="modal-inner-token">&#44;</p><br/>`;

                    console.log(`Key == ${key}`);
                    el.innerHTML += `<p class="modal-inner-key" style="margin-left: ${margin}px;">&#34;${key}&#34;</p>`;
                    el.innerHTML += `<p class="modal-inner-token">&#58;&nbsp;</p>`;
                    if (typeof(repo_json[key]) === "object" && repo_json[key] !== null) {
                    //    console.log(`KEYS ${json_keys[key]['login']}`);
                        showJSONObject(el, repo_json[key], (margin + 16));
                    }
                    else {
                        var val = repo_json[key];
                        var innerHTML = `<p class="modal-inner-token">&#34;${val}$#34;</p>`;

                        if (isNaN(val) || val === false) {
                            console.log(`S'a null -- ${val}`);
                            innerHTML = `<p class="modal-inner-double">&#34;${val}&#34;</p>`;
                            if (typeof(val) === "string") {
                                if (val.substr(0, 4) == "http")
                                    innerHTML = `<a href="${val}" class="modal-inner-link">&quot;${val}$quot;</a>`;
                            }
                            else {
                                if (val === false)
                                    innerHTML = `<p class="modal-inner-token">false</p>`;
                            }
                        }  
                        else {
                                if (val === null)
                                    innerHTML = `<p class="modal-inner-token">null</p>`;
                            else {
                            if (! isNaN(val))
                                innerHTML = `<p class="modal-inner-number">${val}</p>`;  
                            }  
                        }

                        console.log(`innerHTML = ${innerHTML}`);

                        el.innerHTML += innerHTML;
                        if (index >= (json_keys.length - 1)) {
                            if (margin <= 12)
                                el.innerHTML += `<p class="modal-inner-token" style="clear: both; margin-left: ${(margin - 16)}px;">,<br/>}</p><br/>`;
                            else
                                el.innerHTML += `<p class="modal-inner-token" style="clear: both; margin-left: ${(margin - 16)}px;">,<br/>}</p><br/></br/>`;
                        }
                    }
                });
            }

            function highlightJSON(elId, repo_json) {
                let el = document.getElementById(elId);
                el.innerHTML = "";
                console.log("hre");
                showJSONObject(el, repo_json, 16);
            }

            function showRepoJSON(repo_name) {
                console.log("A-thu");
                var repo_json = fetchRepoJSON(git_user, repo_name, function(repo_json) {
                    console.log(`Showing json for repo ${repo_json.name}`);
                    var modal_el = document.getElementById('repo-modal');
                    document.getElementById('modal-title').innerHTML = `${repo_json.name} - <a href="${repo_json.html_url}">${repo_json.git_url}</a>`;
                   // document.getElementById('modal-inner').innerHTML = `<pre>${JSON.stringify(repo_json, null, 2)}</pre>`;
                    document.getElementById('repo-modal').style.display = "block";
                    highlightJSON('modal-inner', repo_json);
                });
            };

            function populateRepo(repo) {
                var repo_link = `${GITHUB_URL}/${git_user}/${repo.name}`;

                return `\
                    <div id="${repo.name}-card" class="repo-card">\
                        <div id="${repo.name}-title" class="repo-title">\
                            ${repo.name}\
                        </div>\
                        <div id="${repo.name}-link" class="repo-link">\
                            <a href="${repo_link}">\
                                ${repo_link}\
                            </a>\
                            <div title="View json" id="${repo.name}-json" class="repo-json">\
                                { }\
                            </div>\
                        </div>\
                    </div>\
                `;
            }

            function showRepo(repo) {
                var parent_el = document.getElementById('wrap');
                var el = document.createElement('div');

                el.setAttribute("id", repo.name);
                el.className = "repo-el";
                el.innerHTML = populateRepo(repo);

                parent_el.appendChild(el);

                document.getElementById(repo.name + "-json").addEventListener("click", () => {
                    showRepoJSON(repo.name);
                });
            }

            function showRepos(repos) {
				document.getElementById("loader").innerHTML = `loaded ${repos.length} repos`;
                repos.forEach(repo => {
                    showRepo(repo);
                })
			};

