const users = require('../data/RPG/users');
const weapons = require('../data/RPG/available_weapon.json');
const armors = require('../data/RPG/available_armor.json');
const skills = require('../data/RPG/available_skills.json');

function addStatsPoint(id, value) {
	const data = users.get(id);
	if (!data) return null;
	data.stats_point = data.stats_point + value;
	users.set(id, data);
	return 1;
}

function levelup(id) {
	const data = users.get(id);
	if (!data) return null;
	if (data.exp < 100) throw Error('not enough exp.');
	data.level = data.level + 1;
	data.exp = data.exp - 100;
	users.set(id, data);
	addStatsPoint(id, 1);
	return true;
}

function getMoney(id) {
	const data = users.get(id);
	if (!data) return null;
	return data.money;
}

function setMoney(id, value) {
	const data = users.get(id);
	if (!data) return null;
	data.money = value;
	users.set(id, data);
	return 1;
}

function getInventory(id) {
	const data = users.get(id);
	if (!data) return null;
	return data.inventory;
}

function addItem(id, name) {
	const data = users.get(id);
	if (!data) return null;
	let item = data.inventory.findIndex(x => x.name === name);
	if (item !== -1) {
		data.inventory[item].value += 1;
	} else {
		const armor = armors.find(x => x.name === name);
		if (armor) {
			const armorIndex = armors.findIndex(x => x.name === name);
			if (armorIndex !== -1) {
				const av_armor = armors[armorIndex];
				av_armor.value = 1;
				data.inventory.push(av_armor);
			} else {
				return null;
			}
		} else {
			return null;
		}
	}
	users.set(id, data);
	return 1;
}

function removeItem(id, name) {
	const data = users.get(id);
	let invent = data.inventory;
	if (!data) return null;
	let item = data.inventory.findIndex(x => x.name === name);
	if (item !== -1) {
		data.inventory[item].value -= 1;
		if (data.inventory[item].value <= 0) {
			data.inventory.splice(item, 1)
		}
	} else {
		return 1;
	}
	users.set(id, data);
	return 1;
}

function addExp(id, value) {
	const data = users.get(id);
	if (!data) return null;
	data.exp = data.exp + value;
	users.set(id, data);
	if (data.exp >= 100) {
		levelup(id);
	}
	return 1;
}

function addStats(id, name, value) {
	const data = users.get(id);
	if (!data) return null;
	if (data.stats_point < value) throw Error('Not enough points');
	data.stats[name] = data.stats[name] + value;
	data.stats_point = data.stats_point - value;
	users.set(id, data);
	return 1;
}

function equipWeapon(id, name) {
	const data = users.get(id);
	if (!data) return null;
	const weapon = data.obtained_weapon.findIndex(x => x.name === name);
	if (weapon !== -1 && !data.equipped_weapon) {
		data.equipped_weapon = name;
		data.obtained_weapon[weapon].value = 0;
		Object.entries(data.obtained_weapon[weapon].effect).forEach(([key, value]) => {
			data.stats[key] = data.stats[key] + value;
		});
	} else {
		return null;
	}
	users.set(id, data);
	return 1;
}

function unequipWeapon(id) {
	const data = users.get(id);
	if (!data) return null;
	if (!data.equipped_weapon) return null;
	const weapon = data.obtained_weapon.findIndex(x => x.name === data.equipped_weapon);
	if (weapon !== -1 && data.equipped_weapon) {
		data.equipped_weapon = null;
		data.obtained_weapon[weapon].value = 1;
		Object.entries(data.obtained_weapon[weapon].effect).forEach(([key, value]) => {
			data.stats[key] = data.stats[key] - value;
		});
	} else {
		return null;
	}
	users.set(id, data);
	return 1;
}

function addWeapon(id, name) {
	const data = users.get(id);
	if (!data) return null;
	const weapon = weapons.filter(x => x.name === name);
	if (!weapon.length) return null;
	weapon[0].value = 1;
	data.obtained_weapon.push(weapon[0])
	users.set(id, data);
	return 1;
}

function equipArmor(id, name) {
	const data = users.get(id);
	if (!data) return null;
	const armor = data.inventory.findIndex(x => x.name === name);
	if (armor !== -1 &&  !data.armor[data.inventory[armor].type]) {
		data.armor[data.inventory[armor].type] = data.inventory[armor].name;
		data.inventory[armor].value = 0;
		Object.entries(data.inventory[armor].effect).forEach(([key, value]) => {
			data.stats[key] = data.stats[key] + value;
		});
	} else {
		return null;
	}
	users.set(id, data)
	return 1;
}

function unequipArmor(id, type) {
	const data = users.get(id);
	if (!data) return null;
	const armorIndex = data.inventory.findIndex(x => x.name === data.armor[type]);
	if (armorIndex !== -1 && data.armor[type]) {
		data.inventory[armorIndex].value = 1;
		Object.entries(data.inventory[armorIndex].effect).forEach(([key, value]) => {
			data.stats[key] = data.stats[key] - value;
		});
	} else {
		return null;
	}
	data.armor[type] = null;
	users.set(id, data);
	return 1;
}

function getWeapons(id) {
	const data = users.get(id);
	if (!data) return null;
	return data.obtained_weapon;
}

function addSkill(id, name) {
	const data = users.get(id);
	if (!data) return null;
	const skill = skills.filter(x => x.name === name);
	if (skill.length) {
		data.owned_skills.push(skill[0]);
	} else {
		return null;
	}
	users.set(id, data);
	return 1;
}

module.exports = { addSkill, getWeapons, levelup, getMoney, setMoney, addItem, removeItem, getInventory, addExp, addStats, equipWeapon, unequipWeapon, addWeapon, equipArmor, unequipArmor };
