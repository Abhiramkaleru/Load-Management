// Use this for testing before backend is ready
// Replace ApiService with this in development

export const ApiServiceMock = {
  async login(username, password) {
    // Mock login
    if (username && password) {
      return {
        token: `mock_token_${Date.now()}`,
        employee: {
          id: 'emp_123',
          username,
          name: 'Test User',
          role: 'salesman',
        },
      };
    }
    throw new Error('Invalid credentials');
  },

  async syncPrepare() {
    // Mock sync_config response
    return {
      warehouse: [
        { id: 'w1', name: 'Warehouse A - Delhi' },
        { id: 'w2', name: 'Warehouse B - Mumbai' },
        { id: 'w3', name: 'Warehouse C - Bangalore' },
      ],
      sku: [
        { id: 's1', name: 'Premium Steel Frame', uom: 'pcs' },
        { id: 's2', name: 'Concrete Mixture', uom: 'kg' },
        { id: 's3', name: 'Reinforced Bars', uom: 'meter' },
        { id: 's4', name: 'Cement Bags', uom: 'pcs' },
        { id: 's5', name: 'Sand', uom: 'ton' },
      ],
    };
  },

  async uploadRequests(requests) {
    // Mock upload → mark as synced
    const synced = requests.map((req) => ({
      uid: req.uid,
      id: `mock_sync_${Date.now()}`,
      inserted: true,
    }));
    return { synced };
  },

  async getChanges(since) {
    // Mock delta sync → return some status updates
    return {
      requests: [], // No changes in mock
      lines: [],
      timestamp: new Date().toISOString(),
    };
  },

  setToken(token) {
    // Mock: do nothing
  },
};