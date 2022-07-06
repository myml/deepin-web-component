import {
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject, fromEvent, map, startWith } from 'rxjs';

@Component({
  selector: 'd-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class HeaderComponent implements OnInit, OnChanges {
  constructor() {}
  phone_show = false;
  icon = 'https://bbs.deepin.org/assets/image/pc/deepin-logo.svg';
  @Input() lang = 'zh';
  @Input() menu?: string;
  @Input() blend = false;
  @HostBinding('class') class = 'd-header';
  @HostBinding('class.top') isTop = true;
  showSubMenuIndex$ = new BehaviorSubject(-1);
  _menu?: Menu[];
  top$ = fromEvent(window, 'scroll').pipe(
    startWith(null),
    map(() => {
      this.isTop = document.documentElement.scrollTop < 80;
      return this.isTop;
    })
  );
  ngOnInit(): void {
    this.initMenu();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.initMenu();
  }
  initMenu() {
    if (this.menu) {
      this._menu = JSON.parse(this.menu);
      return;
    }
    if (this.lang.startsWith('zh')) {
      this._menu = wordpressMenuToJSON(menuZH);
      console.log(this._menu);
    } else {
      this._menu = wordpressMenuToJSON(menuEN);
    }
  }
  menuMouseenter(i: number) {
    this.showSubMenuIndex$.next(i);
  }
}

function mingdaoMenuToJSON(menuStr: string) {
  const menuRaw = menuStr;
  // parse csv
  const arr = menuRaw
    .trim()
    .split('\n')
    .slice(1)
    .map((line) => line.split(','))
    .map((arr) => {
      const [id, title, sort, link, parent] = arr;
      return { id, title, sort: Number(sort), url: link ? link : null, parent };
    });
  // Sort and group
  return arr
    .filter((item) => !item.parent)
    .sort((a, b) => a.sort - b.sort)
    .map((item) => {
      // find children and sort
      const children = arr
        .filter((child) => child.parent === item.title)
        .sort((a, b) => a.sort - b.sort)
        .map((child) => {
          return { name: child.title, url: child.url, children: [] };
        });

      return { name: item.title, url: item.url, children } as Menu;
    });
}

function wordpressMenuToJSON(menuStr: string) {
  const menuRaw = JSON.parse(menuStr.replace(/"(\d+":)/g, '"_$1')) as {
    [key: string]: { name: string; url: string; children: Menu[] };
  };
  Object.values(menuRaw).forEach(
    (obj: any) => (obj['children'] = Object.values(obj['children']))
  );
  const menu: Menu[] = Object.values(menuRaw);
  return menu;
}
export interface Menu {
  name: string;
  url: string;
  children: Menu[];
}

const menuZHMD = `
记录ID,显示名称,位置排序,链接地址,父
13ddb759-ee8a-40da-846b-29f1c8a59320,角色说明,,,社区
13789645-18d9-4dc2-a28c-05c7cca96abf,行为准则,,,社区
69f0d717-36c9-4e4a-b704-12e0563b06e1,贡献者攻略,,,社区
7c6730f0-101b-4961-ab42-f9311fb741b7,国际化,,,社区
8fb0c8ad-8b81-4872-aa0f-0e4b490764d8,应用投递,,,社区
a9419ed2-14ba-458a-bb87-be01e9b49d62,接口文档,,,文档
35fc0ef1-8441-49da-8a69-9fd5ea4923ac,开发者平台,,,文档
621765d6-fbf8-4a2a-bb79-59b23f0e904c,deepin wiki,,,文档
749d494a-7f15-41ad-8a87-4f005108957d,版本规划,,,新闻
e9987c45-814d-425c-ae07-89cfa0ea73d7,社区资讯,,,新闻
d577497a-e1d5-4ce7-92f5-a71a8c1eb31f,衍生版本,,,开源项目
7654e198-77ac-40f1-9f08-e1286712d3a8,原创应用,,,开源项目
77bc76e5-bb78-447d-ae48-ee922446a0c8,深度桌面环境,,,开源项目
5b7f8add-aabb-46e7-bef6-91ce1f38d83b,源码仓库,,,开源项目
6987e57a-46cd-43f3-860e-75b7281fabcc,兴趣小组,80,,
45c44688-fe3d-492a-ba6a-85bb15220aeb,社区,70,,
da8c5ea8-c406-4908-8a3b-6f5d02193040,论坛,60,,
a6d576ac-a943-4c11-bff5-e6cb6f6da59c,文档,50,,
3e1f55ef-c804-43a9-95be-8288d6da6571,新闻,40,,
7493e4a8-f0a8-4d90-aa7e-b27d4c39a393,开源项目,30,,
c7a1152a-89d1-44c3-9e29-ccbd71344be4,深度原创应用,,,下载
0e252f26-4583-4704-8bc5-5225ed9e587e,深度桌面环境,,,下载
666fdc4c-c6d2-43a3-8fa0-c4c11e1a71e3,下载,20,,
e7743474-1ecf-406a-a2e5-1af17826a781,首页,1,,
`;

// Copy from https://www.deepin.org/wp-content/api/menu.php
const menuEN = `{
  "252": { "name": "Home", "url": "https://www.deepin.org/en", "children": [] },
  "14221": {
    "name": "Projects",
    "url": "https://www.deepin.org/en/projects/dde/",
    "children": {
      "269": {
        "name": "Desktop Environment",
        "url": "https://www.deepin.org/en/dde/",
        "children": []
      },
      "20185": {
        "name": "Original Applications",
        "url": "https://www.deepin.org/en/original/deepin-boot-maker/",
        "children": []
      },
      "21587": {
        "name": "Desktop Transplantation",
        "url": "https://www.deepin.org/en/dde/desktop-transplantation/",
        "children": []
      },
      "19604": {
        "name": "Project Update",
        "url": "https://www.deepin.org/en/project-update/",
        "children": []
      }
    }
  },
  "14054": {
    "name": "Download",
    "url": "https://www.deepin.org/en/download",
    "children": {
      "14051": {
        "name": "New Release",
        "url": "https://www.deepin.org/en/download/",
        "children": []
      },
      "24471": {
        "name": "Official Video",
        "url": "https://www.deepin.org/en/deepin-official-video/",
        "children": []
      },
      "19589": {
        "name": "Release Notes",
        "url": "https://www.deepin.org/en/category/release-notes/",
        "children": []
      },
      "19603": {
        "name": "System Update",
        "url": "https://www.deepin.org/en/category/system-update/",
        "children": []
      },
      "20165": {
        "name": "Mirrors",
        "url": "https://www.deepin.org/en/mirrors/packages/",
        "children": []
      }
    }
  },
  "14222": {
    "name": "Documents",
    "url": "https://wiki.deepin.org",
    "children": {
      "302": {
        "name": "Wiki",
        "url": "https://wiki.deepin.org/",
        "children": []
      },
      "13524": {
        "name": "Installation",
        "url": "https://www.deepin.org/en/installation/",
        "children": []
      }
    }
  },
  "19679": {
    "name": "News",
    "url": "https://www.deepin.org/en/community-news/",
    "children": []
  },
  "14223": {
    "name": "AppStore",
    "url": "",
    "children": {
      "19601": {
        "name": "Application Update",
        "url": "https://www.deepin.org/en/application-update/",
        "children": []
      },
      "29745": {
        "name": "Deliver Apps",
        "url": "https://shimo.im/forms/rPw9rRcKV6WkVdrY/fill",
        "children": []
      }
    }
  },
  "14225": {
    "name": "Community",
    "url": "https://bbs.deepin.org/",
    "children": {
      "29338": {
        "name": "Forum",
        "url": "https://bbs.deepin.org/en/module/70",
        "children": []
      }
    }
  },
  "20377": {
    "name": "Developer",
    "url": "https://www.deepin.org/en/developer-community/planning/",
    "children": {
      "291": {
        "name": "Planning",
        "url": "https://www.deepin.org/en/developer-community/planning/",
        "children": []
      },
      "30939": {
        "name": "DTK",
        "url": "https://docs.deepin.org/",
        "children": []
      },
      "21479": {
        "name": "Internationalization",
        "url": "https://www.deepin.org/en/developer-community/internationalization/",
        "children": []
      },
      "31923": {
        "name": "Architectural Design",
        "url": "https://www.deepin.org/en/developer-community/architectural-design/",
        "children": []
      }
    }
  }
}`;
// Copy from https://www.deepin.org/wp-content/api/menu.php
const menuZH = `{
  "252": {
    "name": "\u9996\u9875",
    "url": "https://www.deepin.org/zh",
    "children": []
  },
  "14221": {
    "name": "\u9879\u76ee",
    "url": "https://www.deepin.org/zh/projects/dde/",
    "children": {
      "269": {
        "name": "\u6df1\u5ea6\u684c\u9762\u73af\u5883",
        "url": "https://www.deepin.org/zh/dde/",
        "children": []
      },
      "20185": {
        "name": "\u6df1\u5ea6\u539f\u521b\u5e94\u7528",
        "url": "https://www.deepin.org/zh/original/deepin-boot-maker/",
        "children": []
      },
      "21587": {
        "name": "\u6df1\u5ea6\u684c\u9762\u79fb\u690d",
        "url": "https://www.deepin.org/zh/dde/desktop-transplantation/",
        "children": []
      },
      "19604": {
        "name": "\u9879\u76ee\u66f4\u65b0\u8bb0\u5f55",
        "url": "https://www.deepin.org/zh/project-update/",
        "children": []
      }
    }
  },
  "14054": {
    "name": "\u4e0b\u8f7d",
    "url": "https://www.deepin.org/zh/download",
    "children": {
      "14051": {
        "name": "\u6700\u65b0\u7248\u672c",
        "url": "https://www.deepin.org/zh/download/",
        "children": []
      },
      "24471": {
        "name": "\u5ba3\u4f20\u89c6\u9891",
        "url": "https://www.deepin.org/zh/deepin-official-video/",
        "children": []
      },
      "19589": {
        "name": "\u53d1\u884c\u6ce8\u8bb0",
        "url": "https://www.deepin.org/zh/category/release-notes/",
        "children": []
      },
      "19603": {
        "name": "\u7cfb\u7edf\u66f4\u65b0",
        "url": "https://www.deepin.org/zh/category/system-update/",
        "children": []
      },
      "20165": {
        "name": "\u955c\u50cf\u6e90",
        "url": "https://www.deepin.org/zh/mirrors/packages/",
        "children": []
      }
    }
  },
  "14222": {
    "name": "\u767e\u79d1",
    "url": "https://wiki.deepin.org",
    "children": {
      "302": {
        "name": "\u6df1\u5ea6\u767e\u79d1",
        "url": "https://wiki.deepin.org/",
        "children": []
      },
      "13524": {
        "name": "\u5982\u4f55\u5b89\u88c5",
        "url": "https://www.deepin.org/zh/installation/",
        "children": []
      }
    }
  },
  "19679": {
    "name": "\u65b0\u95fb",
    "url": "https://www.deepin.org/zh/community-news/",
    "children": []
  },
  "29744": {
    "name": "\u62db\u8058",
    "url": "https://bbs.deepin.org/post/207273",
    "children": []
  },
  "14223": {
    "name": "\u5546\u5e97",
    "url": "",
    "children": {
      "19601": {
        "name": "\u66f4\u65b0\u8bb0\u5f55",
        "url": "https://www.deepin.org/zh/application-update/",
        "children": []
      },
      "29745": {
        "name": "\u6295\u9012\u5e94\u7528",
        "url": "https://shimo.im/forms/rPw9rRcKV6WkVdrY/fill",
        "children": []
      }
    }
  },
  "14225": {
    "name": "\u793e\u533a",
    "url": "https://bbs.deepin.org/",
    "children": {
      "314": {
        "name": "\u8bba\u575b",
        "url": "https://bbs.deepin.org/",
        "children": []
      },
      "22218": {
        "name": "\u6b66\u6c49LUG",
        "url": "https://www.deepin.org/zh/welcome-to-whlug/",
        "children": []
      }
    }
  },
  "20377": {
    "name": "\u5f00\u53d1",
    "url": "https://www.deepin.org/zh/developer-community/planning/",
    "children": {
      "291": {
        "name": "\u7248\u672c\u89c4\u5212",
        "url": "https://www.deepin.org/zh/developer-community/planning/",
        "children": []
      },
      "30939": {
        "name": "DTK",
        "url": "https://docs.deepin.org/",
        "children": []
      },
      "21479": {
        "name": "\u56fd\u9645\u5316",
        "url": "https://www.deepin.org/zh/developer-community/internationalization/",
        "children": []
      },
      "31923": {
        "name": "\u67b6\u6784\u8bbe\u8ba1",
        "url": "https://www.deepin.org/zh/developer-community/architectural-design/",
        "children": []
      }
    }
  }
}
`;
