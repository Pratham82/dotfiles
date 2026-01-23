return {
  -- Remove or disable the default colorscheme
  { "folke/tokyonight.nvim" },

  -- Add Catppuccin theme
  -- {
  --   "catppuccin/nvim",
  --   name = "catppuccin",
  --   priority = 1000,
  --   config = function()
  --     require("catppuccin").setup({
  --       flavour = "mocha", -- latte, frappe, macchiato, mocha
  --       integrations = {
  --         treesitter = true,
  --         native_lsp = { enabled = true },
  --         lsp_trouble = true,
  --         telescope = true,
  --         neotree = true,
  --         cmp = true,
  --         gitsigns = true,
  --         mason = true,
  --         notify = true,
  --         noice = true,
  --         mini = true,
  --       },
  --     })
  --     vim.cmd.colorscheme("catppuccin-mocha")
  --   end,
  -- },
  -- {
  --   "shaunsingh/nord.nvim",
  --   lazy = false,
  --   priority = 1000,
  --   config = function()
  --     vim.cmd.colorscheme("nord")
  --   end,
  -- },
  -- Add Pimendres colorscheme
  {
    "olivercederborg/poimandres.nvim",
    lazy = false,
    priority = 1000,
    config = function()
      require("poimandres").setup({
        bold_vert_split = false, -- use bold vertical separators
        dim_nc_background = false, -- dim 'non-current' window backgrounds
        disable_background = false, -- disable background
        disable_float_background = false, -- disable background for floats
        disable_italics = false, -- disable italics
      })
      vim.cmd.colorscheme("poimandres")
    end,
  },

  -- {
  --   "LazyVim/LazyVim",
  --   opts = {
  --     colorscheme = "catppuccin-mocha",
  --   },
  -- },
}
