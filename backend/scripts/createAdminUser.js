import 'dotenv/config';
import bcrypt from 'bcrypt';
import db from '../src/models/index.js';

async function main() {
    try {
        console.log('Ligando à base de dados...');
        await db.sequelize.authenticate();
        console.log('Ligação OK.');

        // ⚠️ DEV: cria as tabelas a partir dos models, se ainda não existirem
        await db.sequelize.sync();
        console.log('Tabelas sincronizadas (criadas se não existiam).');

        const plainPassword = 'admin123';
        const password_hash = await bcrypt.hash(plainPassword, 10);

        const [user, created] = await db.User.findOrCreate({
            where: { email: 'admin@example.com' },
            defaults: {
                name: 'Admin',
                email: 'admin@example.com',
                password_hash,
                role: 'admin',
            },
        });

        if (created) {
            console.log('Utilizador admin criado:');
        } else {
            console.log('Utilizador admin já existia, dados atuais:');
        }

        console.log(user.toJSON());
        console.log('\nCredenciais para login:');
        console.log('  Email:    admin@example.com');
        console.log('  Password: admin123');

        process.exit(0);
    } catch (err) {
        console.error('Erro ao criar utilizador admin:', err);
        process.exit(1);
    }
}

main();
