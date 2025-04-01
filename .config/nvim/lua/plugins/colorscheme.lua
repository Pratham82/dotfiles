return {
  -- Remove or disable the default colorscheme
  { "folke/tokyonight.nvim" },

  -- Add Catppuccin theme
  {
    "catppuccin/nvim",
    name = "catppuccin",
    priority = 1000,
    config = function()
      require("catppuccin").setup({
        flavour = "mocha", -- latte, frappe, macchiato, mocha
        integrations = {
          treesitter = true,
          native_lsp = { enabled = true },
          lsp_trouble = true,
          telescope = true,
          neotree = true,
          cmp = true,
          gitsigns = true,
          mason = true,
          notify = true,
          noice = true,
          mini = true,
        },
      })
      vim.cmd.colorscheme("catppuccin-mocha")
    end,
  },
  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = "catppuccin-mocha",
    },
  },
}
