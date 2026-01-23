-- ~/.config/nvim/lua/plugins/multi_cursors.lua
return {
  {
    "terryma/vim-multiple-cursors",
    event = "VeryLazy", -- lazy load
    config = function()
      -- Optional: VSCode-style keybindings
      vim.g.multi_cursor_start_key = "<C-n>"
      vim.g.multi_cursor_select_all_key = "<C-a>"
      vim.g.multi_cursor_next_key = "<C-n>"
      vim.g.multi_cursor_prev_key = "<C-p>"
      vim.g.multi_cursor_skip_key = "<C-x>"
      vim.g.multi_cursor_quit_key = "<Esc>"
    end,
  },
}
