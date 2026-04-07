
import nextEnv from '@next/env'
const { loadEnvConfig } = nextEnv
loadEnvConfig(process.cwd())

import { getPayload } from 'payload'
import { attributeGroups, attributes, categories, postCategories, pricingPlans, organizers, cities } from '../data/seed-data'
import { PricingPlan, Organizer, AttributeGroup, Category, PostCategory, Attribute } from '@/payload-types'

export const runSeedCore = async () => {
    const configModule = await import('../payload.config')
    const config = configModule.default

    const payload = await getPayload({ config })
    console.log('🌱 Starting CORE data seed...')

    // 0. Seed Cities
    console.log('\n--- Seeding Cities ---')
    for (const city of cities) {
        const existing = await payload.find({
            collection: 'cities',
            where: { slug: { equals: city.slug } },
        })

        if (existing.docs.length === 0) {
            await payload.create({
                collection: 'cities',
                data: city,
            })
            console.log(`✅ Created City: ${city.name}`)
        } else {
            await payload.update({
                collection: 'cities',
                id: existing.docs[0].id,
                data: city,
            })
            console.log(`🔄 Updated City: ${city.name}`)
        }
    }

    // 1. Seed Pricing Plans
    console.log('\n--- Seeding Pricing Plans ---')
    for (const plan of pricingPlans) {
        const existing = await payload.find({
            collection: 'pricing-plans',
            where: { name: { equals: plan.name } },
        })

        if (existing.docs.length === 0) {
            await payload.create({
                collection: 'pricing-plans',
                data: plan as unknown as PricingPlan,
            })
            console.log(`✅ Created Pricing Plan: ${plan.name}`)
        } else {
            await payload.update({
                collection: 'pricing-plans',
                id: existing.docs[0].id,
                data: plan as unknown as PricingPlan,
            })
            console.log(`🔄 Updated Pricing Plan: ${plan.name}`)
        }
    }

    // 2. Seed Organizers (Essential ones)
    console.log('\n--- Seeding Essential Organizers ---')
    for (const org of organizers) {
        const existing = await payload.find({
            collection: 'organizers',
            where: { name: { equals: org.name } },
        })

        const orgData = {
            name: org.name,
            email: org.email,
            website: org.website,
        }

        if (existing.docs.length === 0) {
            await payload.create({
                collection: 'organizers',
                data: orgData as unknown as Organizer,
            })
            console.log(`✅ Created Organizer: ${org.name}`)
        } else {
            await payload.update({
                collection: 'organizers',
                id: existing.docs[0].id,
                data: orgData as unknown as Organizer,
            })
            console.log(`🔄 Updated Organizer: ${org.name}`)
        }
    }

    // 3. Seed Attribute Groups
    console.log('\n--- Seeding Attribute Groups ---')
    const groupMap = new Map<string, string | number>()
    for (const group of attributeGroups) {
        const existing = await payload.find({
            collection: 'attribute-groups',
            where: { slug: { equals: group.slug } },
        })

        let groupId: string | number
        if (existing.docs.length === 0) {
            const created = await payload.create({
                collection: 'attribute-groups',
                data: group as unknown as AttributeGroup,
            })
            groupId = created.id
            console.log(`✅ Created Group: ${group.name}`)
        } else {
            const updated = await payload.update({
                collection: 'attribute-groups',
                id: existing.docs[0].id,
                data: group as unknown as AttributeGroup,
            })
            groupId = updated.id
            console.log(`🔄 Updated Group: ${group.name}`)
        }
        groupMap.set(group.slug, groupId)
    }

    // 4. Seed Categories
    console.log('\n--- Seeding Categories ---')
    const categoryMap = new Map<string, string | number>()
    for (const cat of categories) {
        const existing = await payload.find({
            collection: 'categories',
            where: { slug: { equals: cat.slug } },
        })

        let catId: string | number
        if (existing.docs.length === 0) {
            const created = await payload.create({
                collection: 'categories',
                data: cat as unknown as Category,
            })
            catId = created.id
            console.log(`✅ Created Category: ${cat.title}`)
        } else {
            const updated = await payload.update({
                collection: 'categories',
                id: existing.docs[0].id,
                data: cat as unknown as Category,
            })
            catId = updated.id
            console.log(`🔄 Updated Category: ${cat.title}`)
        }
        categoryMap.set(cat.slug, catId)
    }

    // 4.5 Seed Post Categories
    console.log('\n--- Seeding Post Categories ---')
    for (const cat of postCategories) {
        const existing = await payload.find({
            collection: 'post-categories',
            where: { slug: { equals: cat.slug } },
        })

        if (existing.docs.length === 0) {
            await payload.create({
                collection: 'post-categories',
                data: cat as unknown as PostCategory,
            })
            console.log(`✅ Created Post Category: ${cat.title}`)
        } else {
            await payload.update({
                collection: 'post-categories',
                id: existing.docs[0].id,
                data: cat as unknown as PostCategory,
            })
            console.log(`🔄 Updated Post Category: ${cat.title}`)
        }
    }

    // 5. Seed Attributes
    console.log('\n--- Seeding Attributes ---')
    for (const attr of attributes) {
        const existing = await payload.find({
            collection: 'attributes',
            where: { slug: { equals: attr.slug } },
        })

        const groupId = groupMap.get(attr.groupSlug)
        if (!groupId) {
            console.error(`❌ Group not found for attribute: ${attr.name}`)
            continue
        }

        const categoryIds = attr.categorySlugs
            .map(slug => categoryMap.get(slug))
            .filter((id): id is string | number => !!id)

        const attrData = {
            name: attr.name,
            slug: attr.slug,
            type: attr.type,
            group: groupId,
            categories: categoryIds,
            options: 'options' in attr ? attr.options : undefined,
        }

        if (existing.docs.length === 0) {
            await payload.create({
                collection: 'attributes',
                data: attrData as unknown as Attribute,
            })
            console.log(`✅ Created Attribute: ${attr.name}`)
        } else {
            await payload.update({
                collection: 'attributes',
                id: existing.docs[0].id,
                data: attrData as unknown as Attribute,
            })
            console.log(`🔄 Updated Attribute: ${attr.name}`)
        }
    }

    console.log('\n✨ Core data seed completed successfully!')
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
    runSeedCore()
        .then(() => {
            console.log('✅ Core seed completed via CLI')
            process.exit(0)
        })
        .catch((err) => {
            console.error('❌ Core seed failed:', err)
            process.exit(1)
        })
}
