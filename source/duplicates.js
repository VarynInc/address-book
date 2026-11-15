import { mergeContact } from './import-contacts.js';

function normalizedName(value) {
  return String(value || '').trim().toLowerCase();
}

function nameKey(contact) {
  const last = normalizedName(contact.name?.last);
  if (last) return `last:${last}`;
  const first = normalizedName(contact.name?.first);
  if (first) return `first:${first}`;
  const company = normalizedName(contact.business?.company);
  return company ? `company:${company}` : '';
}

function duplicateContactKey(contact) {
  const address = String(contact.address || '').trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) return `email:${address.toLowerCase()}`;

  const type = String(contact.type || '').toLowerCase();
  if (!/^(phone\d*|mobile|cell|telephone|tel|work|home|fax)$/.test(type)) return '';
  let digits = address.replace(/\D/g, '');
  if (digits.startsWith('1')) digits = digits.slice(1);
  return digits ? `phone:${digits}` : '';
}

export function findDuplicateGroups(contacts) {
  const groups = [];
  const visited = new Set();
  const matches = (first, second) => {
    const firstName = normalizedName(first.name?.first);
    const lastName = normalizedName(first.name?.last);
    if (firstName && lastName
      && firstName === normalizedName(second.name?.first)
      && lastName === normalizedName(second.name?.last)) return true;

    const firstIdentityKey = nameKey(first);
    if (!firstIdentityKey || firstIdentityKey !== nameKey(second)) return false;
    const keys = new Set((first.contacts || []).map(duplicateContactKey).filter(Boolean));
    return (second.contacts || []).some((contact) => keys.has(duplicateContactKey(contact)));
  };
  for (const contact of contacts) {
    if (visited.has(contact.id)) continue;
    const group = [contact];
    visited.add(contact.id);
    for (let index = 0; index < group.length; index += 1) {
      for (const candidate of contacts) {
        if (!visited.has(candidate.id) && matches(group[index], candidate)) {
          group.push(candidate);
          visited.add(candidate.id);
        }
      }
    }
    if (group.length > 1) groups.push(group);
  }
  return groups;
}

export function resolveDuplicateGroup(contacts, ids, keepId, merge = false) {
  const group = contacts.filter((contact) => ids.includes(contact.id));
  const survivor = group.find((contact) => contact.id === keepId);
  if (!survivor) throw new Error('Choose a contact to keep.');
  let kept = structuredClone(survivor);
  if (merge) {
    for (const contact of group) {
      if (contact.id === keepId) continue;
      kept = mergeContact(kept, contact);
      kept.category = [...new Set([...(kept.category || []), ...(contact.category || [])])];
      const notes = String(contact.notes || '').trim();
      if (notes && notes !== String(kept.notes || '').trim()) kept.notes = [kept.notes, notes].filter(Boolean).join('\n\n');
    }
  }
  return contacts.flatMap((contact) => contact.id === keepId ? [kept] : ids.includes(contact.id) ? [] : [contact]);
}