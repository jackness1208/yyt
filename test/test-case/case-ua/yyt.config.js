module.exports = {
  default: {
    src_folders: ['./yyt/test'],
    custom_commands_path: ['./yyt/command'],
    output_folder: false,
    __extend: {
      headless: false,
      userAgent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36 YYT/0.7.3'
    }
  },
  dev: {
    src_folders: ['./yyt/test'],
    custom_commands_path: ['./yyt/command'],
    output_folder: false,
    __extend: {
      proxy: 8887,
      headless: true,
      userAgent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36 YYT/0.7.3'
    }
  }
};
