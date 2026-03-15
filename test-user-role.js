async function test() {
    const BASE_URL = 'http://127.0.0.1:3000/api/v1';
    
    try {
        console.log('--- Testing Roles API ---');
        
        // 1. Create Role
        const roleRes = await fetch(`${BASE_URL}/roles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Admin_' + Date.now(),
                description: 'Administrator role'
            })
        });
        const roleData = await roleRes.json();
        if (!roleRes.ok) throw new Error(roleData.message);
        const roleId = roleData.data._id;
        console.log('Role Created:', roleId);

        // 2. Get all Roles
        const rolesRes = await fetch(`${BASE_URL}/roles`);
        const rolesData = await rolesRes.json();
        console.log('All Roles count:', rolesData.data.length);

        console.log('\n--- Testing Users API ---');

        // 3. Create User
        const userRes = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'user_' + Date.now(),
                password: 'password123',
                email: 'test_' + Date.now() + '@example.com',
                role: roleId
            })
        });
        const userData = await userRes.json();
        if (!userRes.ok) throw new Error(userData.message);
        const userId = userData.data._id;
        const email = userData.data.email;
        const username = userData.data.username;
        console.log('User Created:', userId);

        // 4. Get all Users
        const usersRes = await fetch(`${BASE_URL}/users`);
        const usersData = await usersRes.json();
        console.log('All Users count (active):', usersData.data.length);

        // 5. Test Enable Status
        const enableRes = await fetch(`${BASE_URL}/users/enable`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email })
        });
        const enableData = await enableRes.json();
        console.log('User Enabled:', enableData.data.status);

        // 6. Test Disable Status
        const disableRes = await fetch(`${BASE_URL}/users/disable`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email })
        });
        const disableData = await disableRes.json();
        console.log('User Disabled:', disableData.data.status);

        // 7. Get users by role
        const roleUsersRes = await fetch(`${BASE_URL}/roles/${roleId}/users`);
        const roleUsersData = await roleUsersRes.json();
        console.log('Users for Admin role:', roleUsersData.data.length);

        // 8. Soft Delete User
        await fetch(`${BASE_URL}/users/${userId}`, { method: 'DELETE' });
        const usersAfterDeleteRes = await fetch(`${BASE_URL}/users`);
        const usersAfterDeleteData = await usersAfterDeleteRes.json();
        console.log('All Users count after soft delete:', usersAfterDeleteData.data.length);

        console.log('\nVerification complete!');

    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

test();
