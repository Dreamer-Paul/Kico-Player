/* ----

# KPlayer 0.9
# By: Dreamer-Paul
# Last Update: 2023.5.22

一个简洁强大的网页音乐播放器。

本代码为奇趣保罗原创，并遵守 MIT 开源协议。欢迎访问我的博客：https://paugram.com

---- */

var KPlayer = function KPlayer (settings) {
    var that = this;

    // 状态记录
    var current = {
        id: 0,
        last_id: 0,
        playlist: [],
        randlist: [],
        lyric: [],
        lyric_index: 0,
        play_mode: 0, // 默认、循环、随机模式 normal(0) loop(1) random(2)
        page_title: document.title
    };

    var icons = {
        left: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="currentColor"><path d="M13,10c1.1,0,2,1.35,2,3v3.7l10.495-5.772C27.423,9.867,29,10.8,29,13v14c0,2.2-1.577,3.133-3.505,2.072L15,23.3V27c0,1.65-0.9,3-2,3s-2-1.35-2-3V13C11,11.35,11.9,10,13,10z"/></svg>',
        right: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="currentColor"><path d="M27,10c-1.1,0-2,1.35-2,3v3.7l-10.495-5.772C12.577,9.867,11,10.8,11,13v14c0,2.2,1.577,3.133,3.505,2.072L25,23.3V27c0,1.65,0.9,3,2,3s2-1.35,2-3V13C29,11.35,28.1,10,27,10z"/></svg>',
        play: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="currentColor"><path d="M20,0C8.954,0,0,8.954,0,20c0,11.046,8.954,20,20,20s20-8.954,20-20C40,8.954,31.046,0,20,0z M28.495,21.928l-12.99,7.145C13.577,30.133,12,29.2,12,27V13c0-2.2,1.577-3.133,3.505-2.072l12.99,7.145C30.423,19.133,30.423,20.867,28.495,21.928z"/></svg>',
        pause: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="currentColor"><path d="M20,0C8.954,0,0,8.954,0,20c0,11.046,8.954,20,20,20s20-8.954,20-20C40,8.954,31.046,0,20,0z M17,27c0,1.65-0.9,3-2,3s-2-1.35-2-3V13c0-1.65,0.9-3,2-3s2,1.35,2,3V27z M27,27c0,1.65-0.9,3-2,3s-2-1.35-2-3V13c0-1.65,0.9-3,2-3s2,1.35,2,3V27z"/></svg>',

        none: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="currentColor"><path d="M18.164,24.535c-0.259,0-0.656-0.078-1.076-0.451l-4.13-3.673C12.729,20.208,12.182,20,11.875,20H10.5c-1.103,0-2-0.897-2-2v-8c0-1.103,0.897-2,2-2h1.375c0.307,0,0.854-0.208,1.083-0.412l4.13-3.671c0.42-0.374,0.817-0.452,1.076-0.452C18.828,3.465,19.5,3.992,19.5,5v18C19.5,24.008,18.828,24.535,18.164,24.535z M10.5,10v8h1.375c0.8,0,1.814,0.386,2.412,0.916l3.213,2.856V6.228l-3.213,2.855C13.689,9.614,12.675,10,11.875,10H10.5z"/></svg>',
        low: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="currentColor"><path d="M19.53,17.694l-0.765-1.848c0.494-0.205,0.878-0.589,1.083-1.081c0.422-1.019-0.063-2.191-1.082-2.613l0.765-1.848c2.037,0.843,3.008,3.188,2.164,5.227C21.287,16.518,20.518,17.285,19.53,17.694z"/><path d="M15.664,24.535c-0.259,0-0.656-0.078-1.076-0.451l-4.13-3.673C10.229,20.208,9.682,20,9.375,20H8c-1.103,0-2-0.897-2-2v-8c0-1.103,0.897-2,2-2h1.375c0.307,0,0.854-0.208,1.083-0.412l4.13-3.671c0.42-0.374,0.817-0.452,1.076-0.452C16.328,3.465,17,3.992,17,5v18C17,24.008,16.328,24.535,15.664,24.535z M8,10v8h1.375c0.8,0,1.814,0.386,2.412,0.916L15,21.772V6.228l-3.213,2.855C11.189,9.614,10.175,10,9.375,10H8z"/></svg>',
        mid: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="currentColor"><path d="M19.061,21.388l-0.766-1.848c1.482-0.614,2.637-1.767,3.248-3.244c0.612-1.478,0.611-3.108-0.003-4.591c-0.614-1.482-1.767-2.636-3.244-3.249l0.766-1.848c1.971,0.816,3.508,2.354,4.326,4.331c0.818,1.977,0.819,4.15,0.003,6.122C22.575,19.032,21.037,20.568,19.061,21.388z"/><path d="M17.53,17.694l-0.765-1.848c0.494-0.205,0.878-0.589,1.083-1.081c0.422-1.019-0.063-2.191-1.082-2.613l0.765-1.848c2.037,0.843,3.008,3.188,2.164,5.227C19.287,16.518,18.518,17.285,17.53,17.694z"/><path d="M13.664,24.535c-0.259,0-0.656-0.078-1.076-0.451l-4.13-3.673C8.229,20.208,7.682,20,7.375,20H6c-1.103,0-2-0.897-2-2v-8c0-1.103,0.897-2,2-2h1.375c0.307,0,0.854-0.208,1.083-0.412l4.13-3.671c0.42-0.374,0.817-0.452,1.076-0.452C14.328,3.465,15,3.992,15,5v18C15,24.008,14.328,24.535,13.664,24.535z M6,10v8h1.375c0.8,0,1.814,0.386,2.412,0.916L13,21.772V6.228L9.787,9.083C9.189,9.614,8.175,10,7.375,10H6z"/></svg>',
        max: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="currentColor"><path d="M18.593,25.086l-0.766-1.848c2.467-1.021,4.39-2.943,5.412-5.411c2.109-5.095-0.318-10.956-5.412-13.066l0.766-1.848c6.112,2.532,9.025,9.565,6.494,15.679C23.859,21.554,21.553,23.859,18.593,25.086z"/><path d="M17.061,21.388l-0.766-1.848c1.482-0.614,2.637-1.767,3.248-3.244c0.612-1.478,0.611-3.108-0.003-4.591c-0.614-1.482-1.767-2.636-3.244-3.249l0.766-1.848c1.971,0.816,3.508,2.354,4.326,4.331c0.818,1.977,0.819,4.15,0.003,6.122C20.575,19.032,19.037,20.568,17.061,21.388z"/><path d="M15.53,17.694l-0.765-1.848c0.494-0.205,0.878-0.589,1.083-1.081c0.422-1.019-0.063-2.191-1.082-2.613l0.765-1.848c2.037,0.843,3.008,3.188,2.164,5.227C17.287,16.518,16.518,17.285,15.53,17.694z"/><path d="M11.664,24.535c-0.259,0-0.656-0.078-1.076-0.451l-4.13-3.673C6.229,20.208,5.682,20,5.375,20H4c-1.103,0-2-0.897-2-2v-8c0-1.103,0.897-2,2-2h1.375c0.307,0,0.854-0.208,1.083-0.412l4.13-3.671c0.42-0.374,0.817-0.452,1.076-0.452C12.328,3.465,13,3.992,13,5v18C13,24.008,12.328,24.535,11.664,24.535z M4,10v8h1.375c0.8,0,1.814,0.386,2.412,0.916L11,21.772V6.228L7.787,9.083C7.189,9.614,6.175,10,5.375,10H4z"/></svg>',

        loop_all: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="currentColor"><path d="M9.2,20.4C6.7,19.3,5,16.8,5,14c0-3.9,3.1-7,7-7h1.6l-1.8,1.8c-0.4,0.4-0.4,1,0,1.4c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l3.5-3.5c0.4-0.4,0.4-1,0-1.4l-3.5-3.5c-0.4-0.4-1-0.4-1.4,0c-0.4,0.4-0.4,1,0,1.4L13.6,5H12c-5,0-9,4-9,9c0,3.6,2.1,6.8,5.4,8.3c0.1,0.1,0.3,0.1,0.4,0.1c0.4,0,0.8-0.2,0.9-0.6C10,21.2,9.7,20.6,9.2,20.4z"/><path d="M25,14c0-3.6-2.2-6.9-5.5-8.3c-0.5-0.2-1.1,0-1.3,0.5c-0.2,0.5,0,1.1,0.5,1.3C21.3,8.6,23,11.2,23,14c0,3.9-3.1,7-7,7h-1.6l1.8-1.8c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0l-3.5,3.5c-0.1,0.1-0.2,0.2-0.2,0.3c-0.1,0.2-0.1,0.5,0,0.8c0.1,0.1,0.1,0.2,0.2,0.3l3.5,3.5c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3c0.4-0.4,0.4-1,0-1.4L14.4,23H16C21,23,25,19,25,14z"/></svg>',
        loop_single: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="currentColor"><path d="M9.2,20.4C6.7,19.3,5,16.8,5,14c0-3.9,3.1-7,7-7h1.6l-1.8,1.8c-0.4,0.4-0.4,1,0,1.4c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l3.5-3.5c0.4-0.4,0.4-1,0-1.4l-3.5-3.5c-0.4-0.4-1-0.4-1.4,0c-0.4,0.4-0.4,1,0,1.4L13.6,5H12c-5,0-9,4-9,9c0,3.6,2.1,6.8,5.4,8.3c0.1,0.1,0.3,0.1,0.4,0.1c0.4,0,0.8-0.2,0.9-0.6C10,21.2,9.7,20.6,9.2,20.4z"/><path d="M25,14c0-3.6-2.2-6.9-5.5-8.3c-0.5-0.2-1.1,0-1.3,0.5c-0.2,0.5,0,1.1,0.5,1.3C21.3,8.6,23,11.2,23,14c0,3.9-3.1,7-7,7h-1.6l1.8-1.8c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0l-3.5,3.5c-0.1,0.1-0.2,0.2-0.2,0.3c-0.1,0.2-0.1,0.5,0,0.8c0.1,0.1,0.1,0.2,0.2,0.3l3.5,3.5c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3c0.4-0.4,0.4-1,0-1.4L14.4,23H16C21,23,25,19,25,14z"/><path d="M14,17c-0.6,0-1-0.4-1-1v-4c0-0.6,0.4-1,1-1s1,0.4,1,1v4C15,16.6,14.6,17,14,17z"/></svg>',
        rand: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="currentColor"><path d="M21.334,13.167c-0.305,0-0.604-0.138-0.801-0.4c-0.332-0.442-0.242-1.069,0.2-1.4l2.6-1.95l-2.6-1.95c-0.442-0.331-0.532-0.958-0.2-1.4c0.331-0.441,0.958-0.532,1.399-0.2l3.667,2.75c0.252,0.188,0.4,0.485,0.4,0.8s-0.148,0.611-0.4,0.8l-3.667,2.75C21.753,13.102,21.543,13.167,21.334,13.167z"/><path d="M3,20.5c-0.552,0-1-0.447-1-1s0.448-1,1-1c3.659,0,7.084-1.888,9.165-5.05c2.748-4.178,6.63-5.034,11.613-5.034c0.553,0,1,0.448,1,1s-0.447,1-1,1c-4.459,0-7.678,0.691-9.942,4.133C11.384,18.275,7.334,20.5,3,20.5z"/><path d="M21.334,22.333c-0.305,0-0.604-0.138-0.801-0.4c-0.332-0.441-0.242-1.068,0.2-1.399l2.6-1.95l-2.6-1.95c-0.442-0.331-0.532-0.958-0.2-1.399c0.331-0.442,0.958-0.532,1.399-0.2l3.667,2.75c0.252,0.188,0.4,0.485,0.4,0.8s-0.148,0.611-0.4,0.8l-3.667,2.75C21.753,22.268,21.543,22.333,21.334,22.333z"/><path d="M23.777,19.583c-4.983,0-8.865-0.856-11.613-5.033C10.084,11.388,6.659,9.5,3,9.5c-0.552,0-1-0.448-1-1s0.448-1,1-1c4.334,0,8.384,2.225,10.835,5.95c2.264,3.441,5.482,4.133,9.942,4.133c0.553,0,1,0.447,1,1S24.33,19.583,23.777,19.583z"/></svg>',

        list: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="currentColor"><path d="M25,8H3C2.448,8,2,7.552,2,7s0.448-1,1-1h22c0.553,0,1,0.448,1,1S25.553,8,25,8z"/><path d="M25,15H3c-0.552,0-1-0.448-1-1s0.448-1,1-1h22c0.553,0,1,0.448,1,1S25.553,15,25,15z"/><path d="M25,22H3c-0.552,0-1-0.447-1-1s0.448-1,1-1h22c0.553,0,1,0.447,1,1S25.553,22,25,22z"/></svg>'
    };

    // 小工具
    var tools = {
        // 拖拽文件名称识别
        name: function (filename) {
            filename = filename.replace(/\.ogg|\.mp3|\.wav|\.mp4?/, "");
            var sp = filename.split(/\s\-\s|\s\–\s/);
            return {title: sp[1], artist: sp[0]};
        },
        // 快捷创建对象
        create: function (tag, set) {
            var obj = document.createElement(tag);

            if(!set) return obj;

            if(set.class) obj.className = set.class;
            if(set.text) obj.innerText = set.text;
            if(set.html) obj.innerHTML = set.html;

            return obj;
        },
        // 快捷添加对象
        append: function (obj, child) {
            for(var i = 0; i < child.length; i++){
                obj.appendChild(child[i]);
            }
        }
    };

    // 元素模块
    var elements = {
        container: tools.create("kplayer"),
        player: document.createElement("audio"),
        buttons: { // 操作按钮
            toggle: tools.create("div", { class: "control-item kico-toggle", html: icons.play }),
            prev: tools.create("div", { class: "control-item kico-prev", html: icons.left }),
            next: tools.create("div", { class: "control-item kico-next", html: icons.right }),
            mode: tools.create("div", { class: "setting-item kico-mode", html: icons.loop_all }),
            list: tools.create("div", { class: "setting-item kico-list", html: icons.list }),
            volume: tools.create("div", { class: "setting-item kico-volume", html: icons.max })
        },
        details: { // 歌曲详情
            title: tools.create("span", { class: "kico-title", text: "欢迎使用 Kico Player" }),
            artist: tools.create("span", { class: "kico-artist", text: "奇趣保罗" }),
            cover: tools.create("div", { class: "kp-cover" }),
            time: tools.create("div", { class: "kp-time", text: "00:00" })
        },
        bar: {     // 播放进度条
            wrap: tools.create("div", { class: "kp-bar" }),
            loaded: tools.create("div", { class: "loaded" }),
            played: tools.create("div", { class: "played" })
        },
        playlist: tools.create("div", { class: "kp-list" }),
        lyric: tools.create("span", { text: "欢迎使用 Kico Player" }),
        list_items: []
    };

    // 事件
    var events = {
        onPlay: () => {
            if (!interval) interval = setInterval(interval_fc, 500);

            elements.buttons.toggle.innerHTML = icons.pause;
            actions.title_change(true);
        },
        onPause: () => {
            interval = clearInterval(interval);
            elements.buttons.toggle.innerHTML = icons.play;
            actions.title_change(false);
        },
        onProgress: () => {
            const player = elements.player;
            const percentage = player.buffered.length ? (
                player.buffered.end(player.buffered.length - 1) / player.duration
            ) : 0;

            elements.bar.loaded.style.width = percentage * 100 + "%";
        },
        onError: () => {
            interval = clearInterval(interval);
            elements.buttons.toggle.innerHTML = icons.play;
            actions.title_change(false);

            elements.details.title.innerText = ":(";
            elements.details.artist.innerText = "发生了错误";
        },
        onEnd: () => {
            // 列表和随机列表循环
            if(current.play_mode === 0 || current.play_mode === 2){
                this.next();
            }
            // 单曲循环
            else if(current.play_mode === 1){
                current.lyric_index = 0;
                this.play();
                elements.lyric.innerText = current.playlist[current.id].title + " (" + current.playlist[current.id].artist + ")";
            }
        }
    }

    var wrapper = {
        wrap: tools.create("div", { class: "kp-header" }),
        info: tools.create("div", { class: "kp-info" }),
        ctrl: tools.create("div", { class: "kp-controls" }),
        sets: tools.create("div", { class: "kp-settings" }),
        lyric: tools.create("div", { class: "kp-lyrics" }),
        drop: tools.create("div", { class: "kp-drop", html: "<span>释放鼠标以添加歌曲</span>" })
    };

    var interval;
    var interval_fc = function () {
        actions.update_time();
        actions.update_bar();
        actions.update_lyric_playing();
    };

    // 构造模块
    var build = {
        elements: function () {
            // 歌手歌名
            tools.append(wrapper.info, [elements.details.title, elements.details.artist]);

            // 控制按钮
            tools.append(wrapper.ctrl, [elements.buttons.prev, elements.buttons.toggle, elements.buttons.next]);

            // 设置按钮
            tools.append(wrapper.sets, [elements.buttons.volume, elements.buttons.mode, elements.buttons.list]);

            // 整体框架
            tools.append(wrapper.wrap, [elements.details.cover, elements.details.time, wrapper.info, wrapper.ctrl, wrapper.sets, elements.bar.wrap]);

            wrapper.lyric.appendChild(elements.lyric);

            tools.append(elements.container, [wrapper.wrap, elements.playlist, wrapper.lyric, wrapper.drop]);
            settings.container.appendChild(elements.container); // 总添加

            // 拖动播放
            elements.container.ondragenter = function (e) {
                e.preventDefault();
                wrapper.drop.classList.add("active");
            };
            elements.container.ondragover = function (e) {
                e.preventDefault();
                wrapper.drop.classList.add("active");
            };
            elements.container.ondrag = function (e) {
                e.preventDefault();
                wrapper.drop.classList.add("active");
            };
            elements.container.ondragleave = function (e) {
                e.preventDefault();
                wrapper.drop.classList.remove("active");
            };
            elements.container.ondrop = function (e) {
                e.preventDefault();
                wrapper.drop.classList.remove("active");
                var arr = [];

                for(var i = 0; i < e.dataTransfer.items.length; i++){
                    var s = e.dataTransfer.items[i].getAsFile();

                    if (window.createObjectURL) {
                        url = window.createObjectURL(s)
                    }
                    else if (window.createBlobURL) {
                        url = window.createBlobURL(s)
                    }
                    else if (window.URL && window.URL.createObjectURL) {
                        url = window.URL.createObjectURL(s)
                    }
                    else if (window.webkitURL && window.webkitURL.createObjectURL) {
                        url = window.webkitURL.createObjectURL(s)
                    }

                    var n = tools.name(s.name);

                    arr.push({
                        title: n.title,
                        artist: n.artist,
                        link: url
                    });
                }

                that.add(arr);
                that.jump(current.playlist.length - 1);
            };

            // 播放器
            elements.player.volume = 1;

            elements.player.addEventListener("play", events.onPlay);
            elements.player.addEventListener("pause", events.onPause);
            elements.player.addEventListener("progress", events.onProgress);
            elements.player.addEventListener("error", events.onError);
            elements.player.addEventListener("ended", events.onEnd);

            // 按钮们
            elements.buttons.toggle.addEventListener("click", that.toggle);
            elements.buttons.prev.addEventListener("click", that.prev);
            elements.buttons.next.addEventListener("click", that.next);
            elements.buttons.mode.addEventListener("click", that.mode);
            elements.buttons.list.addEventListener("click", that.toggle_list);
            elements.buttons.volume.addEventListener("click", that.toggle_volume);

            // 进度条
            elements.bar.wrap.appendChild(elements.bar.loaded);
            elements.bar.wrap.appendChild(elements.bar.played);
            elements.bar.wrap.addEventListener("click", function (t) {
                if (!elements.player.currentTime) return;

                elements.player.currentTime = (t.offsetX / elements.bar.wrap.clientWidth) * elements.player.duration;
                actions.update_bar();
                actions.update_time();

                current.lyric.length && actions.update_lyric();
            });
        },
        playlist: function (item) {
            function add(s) {
                current.playlist.push(s);
                current.randlist.push(s);

                var id = current.playlist.length - 1;
                var li = tools.create("div", { class: "list-item" });

                li.innerHTML = "<span class='item-number'>" + (id + 1) +
                    "</span><span class='item-title'>" + current.playlist[id].title +
                    "</span><span class='item-artist'>" + current.playlist[id].artist + "</span>";

                li.onclick = function () {
                    if(current.id === id){
                        that.toggle();
                    }
                    else {
                        current.id = id;
                        that.jump(current.id);
                    }
                };

                elements.playlist.appendChild(li);
                elements.list_items.push(li);
            }

            item.forEach(function (t) {
                add(t);
            });
        },
        randlist: function () {
            for(var i = 0; i < current.randlist.length - 1; i++){
                i++;
                var a = calc.random(0, current.randlist.length - 1);
                var b = calc.random(0, current.randlist.length - 1);
                var cache = current.randlist[a];

                current.randlist[a] = current.randlist[b];
                current.randlist[b] = cache;
            }
        },
        lyric: function (lyric, sub_lyric) {
            if (!lyric) {
                current.lyric = [];
                elements.lyric.innerText = "纯音乐，请欣赏...";
                return;
            }

            elements.lyric.innerText = `${current.playlist[current.id].title} (${current.playlist[current.id].artist})`;

            var time, text, sub_text;

            // var text = lyric.match(/\[[0-9]{2,}:[0-9]{2}\.[0-9]{2,}\](\S| )+/g).replace(/\[[0-9]{2,}:[0-9]{2}\.[0-9]{2,}\]/g);

            time = lyric.match(/\d{2,}:\d{2,}.\d{1,4}/g);
            text = lyric.match(/\d{1}\]+.*/g);

            if(sub_lyric) sub_text = sub_lyric.match(/\d{1}\]+.*/g);

            if(settings.debug) console.log(time, text, sub_text);

            // 时间和歌词数量解析结果对的上
            if (time && (time.length === text.length)) {
                current.lyric = time.map((item, index) => {
                    const _range = item.match(/\d+/g);
                    const min = parseInt(_range[0] * 60);
                    const sec = parseInt(_range[1]);
                    const ms = parseFloat(_range[2].substr(0, 2) / 60);

                    const _lyric = {
                        time: min + sec + ms,
                        text: text[index].substr(2)
                    }

                    if (sub_text && text.length === sub_text.length) {
                        _lyric.sub_text = sub_text[index].substr(2);
                    }

                    return _lyric;
                });

                if(settings.debug) console.log(current.lyric);
            }
            else {
                current.lyric = [{
                    time: 0,
                    text: "当前歌词不支持滚动"
                }];
            }
        }
    };

    // 播放与暂停切换
    this.play = function () {
        elements.player.src && elements.player.play();
    };
    this.pause = function () {
        elements.player.src && elements.player.pause();
    };
    this.toggle = function () {
        if(elements.player.src){
            elements.player.paused ? elements.player.play() : elements.player.pause();
        }
        else{
            that.jump(current.id);
        }
    };

    this.jump = function (id) {
        if(id === undefined) return;

        // 更新信息
        current.id = id;
        current.lyric_index = 0;

        elements.details.title.innerText = current.playlist[current.id].title;
        elements.details.artist.innerText = current.playlist[current.id].artist;
        elements.details.cover.style.backgroundImage = current.playlist[current.id].cover ? "url('" + current.playlist[current.id].cover + "')" : "";
        elements.player.src = current.playlist[current.id].link;
        elements.player.play();

        if("mediaSession" in navigator){
            var _meta = {
                title: current.playlist[current.id].title,
                artist: current.playlist[current.id].artist,
            };

            if(current.playlist[current.id].album) _meta.album = current.playlist[current.id].album;
            if(current.playlist[current.id].cover) _meta.artwork = [{ src: current.playlist[current.id].cover }]

            navigator.mediaSession.metadata = new MediaMetadata(_meta);
            navigator.mediaSession.setActionHandler("play", that.play);
            navigator.mediaSession.setActionHandler("pause", that.pause);
            navigator.mediaSession.setActionHandler("previoustrack", that.prev);
            navigator.mediaSession.setActionHandler("nexttrack", that.next);
        }

        // 上次播放记录
        if(elements.list_items[current.last_id]) elements.list_items[current.last_id].classList.remove("current");
        elements.list_items[current.id].classList.add("current");
        current.last_id = current.id;

        // 如果有歌词则处理歌词
        build.lyric(current.playlist[current.id].lyric, current.playlist[current.id].sub_lyric);

        if(settings.debug) console.log("当前 ID：" + current.id);
    };

    // 上一首
    this.prev = function () {
        if(current.play_mode === 0 || current.play_mode === 1) {
            current.id > 0 ? current.id-- : current.id = current.playlist.length - 1;
            that.jump(current.id);
        }
        else if(current.play_mode === 2){
            var a = current.randlist.indexOf(current.playlist[current.id]);
            a === 0 ? current.id = current.randlist.length - 1 : current.id = current.playlist.indexOf(current.randlist[a - 1]);
            that.jump(current.id);
        }
    };

    // 下一首
    this.next = function () {
        current.lyric_index = 0;

        if(current.play_mode === 0 || current.play_mode === 1){
            current.id < current.playlist.length-1 ? current.id++ : current.id = 0;
            that.jump(current.id);
        }
        else if(current.play_mode === 2){
            var a = current.randlist.indexOf(current.playlist[current.id]);
            a === current.randlist.length - 1 ? current.id = current.playlist.indexOf(current.randlist[0]) : current.id = current.playlist.indexOf(current.randlist[a + 1]);
            that.jump(current.id);
        }
    };

    // 播放模式
    this.mode = function () {
        var btn = elements.buttons.mode;

        switch (current.play_mode){
            case 0: current.play_mode = 1; btn.innerHTML = icons.loop_single; break;
            case 1: current.play_mode = 2; btn.innerHTML = icons.rand; build.randlist(); break;
            case 2: current.play_mode = 0; btn.innerHTML = icons.loop_all; break;
        }

        if(settings.debug) console.log("当前播放模式：" + current.play_mode);
    };

    // 添加歌曲
    this.add = function (item) {
        build.playlist(item);
    };

    // 移除歌曲
    this.remove = function () {
        if(current.playlist.length > 0){
            if(current.randlist){
                var del = current.randlist.indexOf(current.playlist[current.playlist.length - 1]);
                current.randlist.splice(del, 1);
            }
            elements.playlist.removeChild(elements.list_items[elements.list_items.length - 1]);
            current.playlist.pop();
            elements.list_items.pop();
        }
    };

    // 播放列表切换显示
    this.toggle_list = function () {
        elements.playlist.classList.toggle("show");
    };

    // 切换音量
    this.toggle_volume = function () {
        var btn = elements.buttons.volume;
        var player = elements.player;

        switch (player.volume){
            case 1: player.volume = 0.75; btn.innerHTML = icons.mid; break;
            case 0.75: player.volume = 0.50; btn.innerHTML = icons.low; break;
            case 0.50: player.volume = 0.25; btn.innerHTML = icons.none; break;
            case 0.25: player.volume = 1; btn.innerHTML = icons.max; break;
        }
    };

    // 卸载播放器
    this.destroy = function () {
        events.onPause();
        elements.player.pause();

        elements.player.removeEventListener("play", events.onPlay);
        elements.player.removeEventListener("pause", events.onPause);
        elements.player.removeEventListener("progress", events.onProgress);
        elements.player.removeEventListener("error", events.onError);
        elements.player.removeEventListener("ended", events.onEnd);

        elements.buttons.toggle.removeEventListener("click", that.toggle);
        elements.buttons.prev.removeEventListener("click", that.prev);
        elements.buttons.next.removeEventListener("click", that.next);
        elements.buttons.mode.removeEventListener("click", that.mode);
        elements.buttons.list.removeEventListener("click", that.toggle_list);
        elements.buttons.volume.removeEventListener("click", that.toggle_volume);

        elements.player = undefined;
        elements.buttons = undefined;

        elements.container.remove();
    }

    // 事件模块
    var actions = {
        // 拖拽进度条更新歌词
        update_lyric: function () {
            var num = 0;

            current.lyric.forEach(function (t, index) {
                if(elements.player.currentTime > t.time){
                    num = index;
                    return false;
                }
            });

            current.lyric_index = num;

            if(current.lyric[num].sub_text){
                elements.lyric.innerHTML = current.lyric[num].text.toString() + "<br><br>" + current.lyric[num].sub_text.toString();
            }
            else{
                elements.lyric.innerText = current.lyric[num].text.toString();
            }
        },
        // 播放过程中更新歌词
        update_lyric_playing: function () {
            if(!current.lyric.length) return;

            if(current.lyric[current.lyric_index] && elements.player.currentTime > current.lyric[current.lyric_index].time){
                elements.lyric.innerText = current.lyric[current.lyric_index].text;
                if(current.lyric[current.lyric_index].sub_text){
                    elements.lyric.innerHTML = current.lyric[current.lyric_index].text + "<br><br>" + current.lyric[current.lyric_index].sub_text;
                }
                else{
                    elements.lyric.innerText = current.lyric[current.lyric_index].text;
                }
                current.lyric_index++;
            }
        },
        update_time: function () {
            elements.details.time.innerText = calc.sec_time(elements.player.currentTime);
        },
        update_bar: function () {
            elements.bar.played.style.width = (elements.player.currentTime / elements.player.duration) * 100 + "%";
        },
        title_change: function (stat) {
            settings.title_change && current.playlist[current.id] && stat === true ? document.title = "▶ " + current.playlist[current.id].title + " - " + current.page_title : document.title = current.page_title;
        }
    };

    // 计算函数
    var calc = {
        add_zero: function (num) {
            return num < 10 ? "0" + num : num;
        },
        sec_time: function (second) {
            if(isNaN(second)){
                return "00:00";
            }
            else{
                var min = parseInt(second / 60);
                var sec = parseInt(second - min * 60);
                var hours = parseInt(min / 60);
                var minAdjust = parseInt(second / 60 - 60 * parseInt(second / 60 / 60));

                return second >= 3600 ? `${calc.add_zero(hours)}:${calc.add_zero(minAdjust)}:${calc.add_zero(sec)}` : `${calc.add_zero(min)}:${calc.add_zero(sec)}`;
            }
        },
        random: function (min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        }
    };

    // 执行函数
    (function () {
        build.elements();
        build.playlist(settings.playlist);

        if(settings.show_list === true){
            that.toggle_list();
        }
        if(settings.debug){
            console.log("MP3 兼容情况：" + elements.player.canPlayType("audio/mp3"));
            console.log("OGG 兼容情况：" + elements.player.canPlayType("audio/ogg"));
            console.log("WAV 兼容情况：" + elements.player.canPlayType("audio/wav"));
        }

        var user_agent = navigator.userAgent.toLowerCase().match(/mobile/g);

        if(settings.autoplay === true && user_agent === null) that.jump(current.id);
    })();
};

console.log("%c Kico Player %c https://paugram.com ","color: #fff; margin: 1em 0; padding: 5px 0; background: #3498db;","margin: 1em 0; padding: 5px 0; background: #efefef;");
