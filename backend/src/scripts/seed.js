import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Service from '../models/Service.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/servicefinder';

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('📦 Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Service.deleteMany({});
        console.log('🗑️ Cleared existing data');

        // Create sample providers
        const providers = await User.create([
            {
                name: 'Carlos Ferreira',
                email: 'carlos@email.com',
                password: 'senha123',
                phone: '923456789',
                userType: 'provider',
                location: { city: 'Luanda', state: 'Luanda' }
            },
            {
                name: 'Maria Santos',
                email: 'maria@email.com',
                password: 'senha123',
                phone: '912345678',
                userType: 'provider',
                location: { city: 'Luanda', state: 'Luanda' }
            },
            {
                name: 'João Manuel',
                email: 'joao@email.com',
                password: 'senha123',
                phone: '934567890',
                userType: 'provider',
                location: { city: 'Benguela', state: 'Benguela' }
            }
        ]);
        console.log(`✅ Created ${providers.length} providers`);

        // Create sample client
        const client = await User.create({
            name: 'Ana Cliente',
            email: 'ana@email.com',
            password: 'senha123',
            phone: '945678901',
            userType: 'client',
            location: { city: 'Luanda', state: 'Luanda' }
        });
        console.log('✅ Created sample client');

        // Create services
        const services = await Service.create([
            {
                providerId: providers[0]._id,
                title: 'Eletricista Residencial',
                description: 'Instalação e manutenção elétrica. Reparos em tomadas, disjuntores e iluminação.',
                category: 'home-repairs',
                subcategory: 'eletricista',
                priceRange: { min: 5000, max: 25000 },
                location: { city: 'Luanda', state: 'Luanda' },
                rating: { average: 4.8, count: 23 }
            },
            {
                providerId: providers[1]._id,
                title: 'Cabeleireira Profissional',
                description: 'Cortes, coloração, tratamentos capilares e penteados para todas as ocasiões.',
                category: 'beauty',
                subcategory: 'cabelereiro',
                priceRange: { min: 3000, max: 15000 },
                location: { city: 'Luanda', state: 'Luanda' },
                rating: { average: 4.9, count: 45 }
            },
            {
                providerId: providers[2]._id,
                title: 'Técnico de Informática',
                description: 'Manutenção de computadores, instalação de software e redes.',
                category: 'tech',
                subcategory: 'informatica',
                priceRange: { min: 8000, max: 30000 },
                location: { city: 'Benguela', state: 'Benguela' },
                rating: { average: 4.6, count: 18 }
            },
            {
                providerId: providers[0]._id,
                title: 'Encanador',
                description: 'Reparos em torneiras, canos, caixas de água e esgotos.',
                category: 'home-repairs',
                subcategory: 'encanador',
                priceRange: { min: 4000, max: 20000 },
                location: { city: 'Luanda', state: 'Luanda' },
                rating: { average: 4.5, count: 12 }
            },
            {
                providerId: providers[1]._id,
                title: 'Manicure e Pedicure',
                description: 'Cuidados completos para unhas das mãos e pés. Esmaltação em gel.',
                category: 'beauty',
                subcategory: 'manicure',
                priceRange: { min: 2000, max: 8000 },
                location: { city: 'Luanda', state: 'Luanda' },
                rating: { average: 4.7, count: 38 }
            }
        ]);
        console.log(`✅ Created ${services.length} services`);

        console.log('\n🎉 Seed completed successfully!');
        console.log('\n📋 Test credentials:');
        console.log('   Client: ana@email.com / senha123');
        console.log('   Provider: carlos@email.com / senha123');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedData();
