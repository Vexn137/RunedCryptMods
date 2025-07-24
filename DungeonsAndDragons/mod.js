try {
  window.registerMod({
    onLoad() {
      console.log("Dungeons & Dragons loaded!");
      window.world.sections = [
        {
          type: 'info',
          name: "Character Info",
          w: 8, h: 4, content: `
            <h2>Character Info</h2>
            <div class="form-grid">
              <div><label>Name</label><input type="text" data-bind="name"></div>
              <div><label>Race</label><select data-bind="race" data-options="races"></select></div>
              <div><label>Class</label><select data-bind="class" data-options="classes"></select></div>
              <div><label>Background</label><select data-bind="background" data-options="backgrounds"></select></div>
              <div><label>Level</label><input type="number" value="1" data-bind="level"></div>
              <div><label>Alignment</label><select data-bind="alignment" data-options="alignments"></select></div>
              <div><label>Player Name</label><input type="text" data-bind="player_name"></div>
            </div>
          `
        },
        {
          type: 'stats',
          name: "Stats",
          w: 4, h: 2,
          content: `
            <h2>Stats</h2>
            <div class="grid-cols">
            ${['STR','DEX','CON','INT','WIS','CHA'].map(stat => `
              <div>
                <label>${stat}</label>
                <input type="number" value="10" data-bind="stats.${stat}">
                <span class="modifier" data-modifier-for="stats.${stat}" data-bind"statmodifiers.${stat}">+0</span>
              </div>
            `).join('')}
            </div>
          `,
          onCreation: function(widget) {
            function updateModifier(stat, value) {
              const modifier = Math.floor((value - 10) / 2);
              const modifierSpan = widget.querySelector(`[data-modifier-for="stats.${stat}"]`);
              if (modifierSpan) {
                modifierSpan.textContent = (modifier >= 0 ? '+' : '') + modifier;
              }
            }
            function updateAllModifiers() {
              const inputs = widget.querySelectorAll('input[data-bind]');
              inputs.forEach(input => {
                const bind = input.getAttribute('data-bind'); // e.g., "stats.STR"
                const stat = bind.split('.')[1]; // Extract "STR"
                const value = parseInt(input.value, 10);
                updateModifier(stat, value);
              });
            }
            widget.querySelectorAll('input[data-bind]').forEach(input => {
              input.addEventListener('change', updateAllModifiers);
            });
            updateAllModifiers();
          }
        },
        {
          type: 'saving_throws',
          name: "Saving Throws",
          w: 4, h: 2,
          content: `
              <h2>Saving Throws</h2>
              <div class="checkbox-list">
              ${['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(stat => `
                  <label><input type="checkbox" data-bind="saving_throws.${stat}"> ${stat}</label>
              `).join('')}
              </div>
          `
        },
        {
          type: 'skills',
          name: "Skills",
          w: 3, h: 8,
          content: `
              <h2>Skills</h2>
              <div class="checkbox-list">
              ${[
                  'Acrobatics (DEX)', 'Animal Handling (WIS)', 'Arcana (INT)', 'Athletics (STR)',
                  'Deception (CHA)', 'History (INT)', 'Insight (WIS)', 'Intimidation (CHA)',
                  'Investigation (INT)', 'Medicine (WIS)', 'Nature (INT)', 'Perception (WIS)',
                  'Performance (CHA)', 'Persuasion (CHA)', 'Religion (INT)', 'Sleight of Hand (DEX)',
                  'Stealth (DEX)', 'Survival (WIS)'
              ].map(skill => {
                  const key = skill.split(' ')[0].toLowerCase(); // e.g. 'Acrobatics' → 'acrobatics'
                  return `<label><input type="checkbox" data-bind="skills.${key}"> ${skill}</label>`;
              }).join('')}
              </div>
          `
        },
        {
          type: 'combat_stats',
          name: "Combat Stats",
          w: 4, h: 2,
          content: `
              <h2>Combat Stats</h2>
              <div class="form-grid">
              <div><label>Armor Class</label><input type="number" data-bind="combat.ac"></div>
              <div><label>Initiative</label><input type="number" data-bind="combat.initiative"></div>
              <div><label>Speed</label><input type="number" data-bind="combat.speed"></div>
              <div><label>Hit Points</label><input type="number" data-bind="combat.hp"></div>
              <div><label>Temporary HP</label><input type="number" data-bind="combat.temp_hp"></div>
              </div>
          `
        },
        {
          type: 'attacks',
          name: "Attacks",
          w: 4, h: 2,
          content: `
              <h2>Attacks</h2>
              <div class="form-grid">
              ${[0,1].map(i => `
                  <div>
                  <label>Weapon</label><input type="text" data-bind="attacks.${i}.name">
                  <label>Attack Bonus</label><input type="text" data-bind="attacks.${i}.bonus">
                  <label>Damage</label><input type="text" data-bind="attacks.${i}.damage">
                  </div>
              `).join('')}
              </div>
          `
        },
        {
          type: 'equipment',
          name: "Equipment",
          w: 4, h: 2,
          content: `
              <h2>Equipment</h2>
              <textarea rows="6" data-bind="equipment" placeholder="Weapons, armor, gear..."></textarea>
          `
        },
        {
          type: 'features',
          name: "Features & Traits",
          w: 4, h: 2,
          content: `
              <h2>Features & Traits</h2>
              <textarea rows="6" data-bind="features_traits" placeholder="Class features, racial traits, etc."></textarea>
          `
        },
        {
          type: 'spellcasting',
          name: "Spellcasting",
          w: 4, h: 4,
          content: `
              <h2>Spellcasting</h2>
              <div class="form-grid">
              <div><label>Spellcasting Class</label><input type="text" data-bind="spellcasting.class"></div>
              <div><label>Spell Save DC</label><input type="number" data-bind="spellcasting.dc"></div>
              <div><label>Spell Attack Bonus</label><input type="number" data-bind="spellcasting.attack_bonus"></div>
              </div>
              <label>Cantrips</label><textarea rows="2" data-bind="spellcasting.cantrips"></textarea>
              <label>Level 1 Spells</label><textarea rows="2" data-bind="spellcasting.level1"></textarea>
              <label>Level 2 Spells</label><textarea rows="2" data-bind="spellcasting.level2"></textarea>
              <label>Higher Level Spells</label><textarea rows="2" data-bind="spellcasting.higher_levels"></textarea>
          `
        }
      ]
    },
    onUnload() { console.log("Dungeons & Dragons unloaded"); }
  });
} catch (e) {
  console.error("registerMod failed:", e);
}