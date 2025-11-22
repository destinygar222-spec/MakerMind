
import { Tool, ToolCategory } from './types';

export const COMMON_TOOLS: Tool[] = [
  // General & Woodworking
  { id: 't1', name: 'Hammer', category: ToolCategory.General },
  { id: 't2', name: 'Drill', category: ToolCategory.General },
  { id: 't9', name: 'Miter Saw', category: ToolCategory.Woodworking },
  { id: 't10', name: 'Sander', category: ToolCategory.Woodworking },
  { id: 't17', name: 'Dremel/Rotary Tool', category: ToolCategory.Woodworking },
  { id: 't24', name: 'Jigsaw', category: ToolCategory.Woodworking },
  { id: 't13', name: 'Soldering Iron', category: ToolCategory.General },
  { id: 't18', name: '3D Printer', category: ToolCategory.General },

  // Baking & Cooking (Expanded)
  { id: 't3', name: 'Stand Mixer', category: ToolCategory.Baking },
  { id: 't4', name: 'Rolling Pin', category: ToolCategory.Baking },
  { id: 't12', name: 'Oven', category: ToolCategory.Baking },
  { id: 't23', name: 'Blender', category: ToolCategory.Cooking },
  { id: 't19', name: 'Pasta Maker', category: ToolCategory.Cooking },
  { id: 't25', name: 'Food Processor', category: ToolCategory.Cooking },
  { id: 't26', name: 'Cast Iron Skillet', category: ToolCategory.Cooking },
  { id: 't27', name: 'Dutch Oven', category: ToolCategory.Cooking },
  { id: 't28', name: 'Chef\'s Knife Set', category: ToolCategory.Cooking },
  { id: 't29', name: 'Muffin/Cupcake Tin', category: ToolCategory.Baking },
  { id: 't30', name: 'Baking Sheets', category: ToolCategory.Baking },
  { id: 't31', name: 'Piping Bags/Tips', category: ToolCategory.Baking },
  { id: 't32', name: 'Digital Scale', category: ToolCategory.Baking },
  { id: 't33', name: 'Hand Mixer', category: ToolCategory.Baking },
  { id: 't34', name: 'Slow Cooker/Crockpot', category: ToolCategory.Cooking },
  
  // Textile
  { id: 't5', name: 'Sewing Machine', category: ToolCategory.Textile },
  { id: 't6', name: 'Embroidery Hoop', category: ToolCategory.Textile },
  { id: 't14', name: 'Knitting Needles', category: ToolCategory.Textile },
  { id: 't15', name: 'Crochet Hook', category: ToolCategory.Textile },
  { id: 't21', name: 'Serger', category: ToolCategory.Textile },

  // Crafting & Art
  { id: 't7', name: 'Glue Gun', category: ToolCategory.Crafting },
  { id: 't8', name: 'Cricut/Die Cutter', category: ToolCategory.Crafting },
  { id: 't11', name: 'Paint Brushes', category: ToolCategory.Crafting },
  { id: 't16', name: 'Potter\'s Wheel', category: ToolCategory.Crafting },
  { id: 't20', name: 'Jewelry Pliers', category: ToolCategory.Crafting },
  { id: 't22', name: 'Easel', category: ToolCategory.Crafting },
  { id: 't35', name: 'Paper Trimmer', category: ToolCategory.Crafting },
  { id: 't36', name: 'X-Acto/Precision Knife', category: ToolCategory.Crafting },

  // Affordable Supplies / Basic Stash
  { id: 's1', name: 'Cardboard Stash', category: ToolCategory.BasicSupplies },
  { id: 's2', name: 'Scrap Paper/Magazines', category: ToolCategory.BasicSupplies },
  { id: 's3', name: 'Bead Collection', category: ToolCategory.BasicSupplies },
  { id: 's4', name: 'Acrylic Paints', category: ToolCategory.BasicSupplies },
  { id: 's5', name: 'Mod Podge/Glue', category: ToolCategory.BasicSupplies },
  { id: 's6', name: 'Polymer/Air Dry Clay', category: ToolCategory.BasicSupplies },
  { id: 's7', name: 'Yarn Scraps', category: ToolCategory.BasicSupplies },
  { id: 's8', name: 'Fabric Scraps', category: ToolCategory.BasicSupplies },
];

export const PROJECT_COLORS = [
  'bg-rosa-500',
  'bg-azul-500',
  'bg-sol-500',
  'bg-naranja-500',
  'bg-verde-500',
  'bg-morado-500',
  'bg-cobalt-500'
];

export const STYLE_OPTIONS = [
  { id: 'mexican-folk', name: 'Mexican Folk', color: 'bg-rosa-500' },
  { id: 'maximalist', name: 'Maximalist', color: 'bg-sol-500' },
  { id: 'boho', name: 'Bohemian', color: 'bg-naranja-500' },
  { id: 'cottagecore', name: 'Cottagecore', color: 'bg-verde-500' },
  { id: 'rustic', name: 'Rustic', color: 'bg-azul-700' },
  { id: 'eclectic', name: 'Eclectic', color: 'bg-morado-500' },
  { id: 'industrial', name: 'Industrial', color: 'bg-gray-800' },
  { id: 'art-deco', name: 'Art Deco', color: 'bg-cobalt-500' },
  { id: 'forest', name: 'Forest/Nature', color: 'bg-verde-700' },
  { id: 'surrealist', name: 'Surrealist', color: 'bg-rosa-700' },
  { id: 'mid-century', name: 'Mid-Century', color: 'bg-naranja-700' },
  { id: 'gothic', name: 'Gothic', color: 'bg-black' },
];

export const SKILL_CATEGORIES = ['Baking', 'Cooking', 'Woodworking', 'Sewing', 'Painting', 'General Crafting', 'Pottery', 'Jewelry'];
