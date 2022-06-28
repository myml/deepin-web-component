import {
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';

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
  @HostBinding('class') class = 'd-header';

  _menu?: Menu[];
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
    } else {
      this._menu = wordpressMenuToJSON(menuEN);
    }
  }
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
        "url": "https://www.deepin.org/en/release-notes/",
        "children": []
      },
      "19603": {
        "name": "System Update",
        "url": "https://www.deepin.org/en/system-update/",
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
        "url": "https://www.deepin.org/zh/release-notes/",
        "children": []
      },
      "19603": {
        "name": "\u7cfb\u7edf\u66f4\u65b0",
        "url": "https://www.deepin.org/zh/system-update/",
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
