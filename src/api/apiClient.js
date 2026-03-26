// Replace 'YOUR_INFINITYFREE_DOMAIN.epizy.com' with your actual InfinityFree domain
// Make sure it points to the directory where your backend API is hosted.
const BASE_URL = 'http://YOUR_INFINITYFREE_DOMAIN.epizy.com/backend/api';

async function fetchApi(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    if (!response.ok) throw new Error(text || 'Network response was not ok');
    return null;
  }

  if (!response.ok) {
    throw new Error(data.error || 'API Error');
  }

  return data;
}

export const api = {
  auth: {
    me: async () => {
      // Fetching the user from PHP. Role=admin mimics what AuthContext/AdminLogin expect.
      // Adjust appropriately if actual auth flow is present in PHP.
      return fetchApi('/auth.php?action=me&role=admin', { method: 'GET' });
    },
    adminLogin: async (credentials) => {
      return fetchApi('/auth.php?action=admin_login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
    },
    logout: async () => {
      // Local implementation logout
      console.log('Logged out locally');
    },
    redirectToLogin: (url) => {
      window.location.href = url || '/login';
    }
  },
  entities: {
    Mechanic: {
      list: async (sort = '') => {
        let qs = '';
        if (sort) qs = `?sort=${sort}`;
        return fetchApi(`/mechanics.php${qs}`, { method: 'GET' });
      },
      filter: async (params, sort = '') => {
        const urlParams = new URLSearchParams(params);
        if (sort) urlParams.append('sort', sort);
        return fetchApi(`/mechanics.php?${urlParams.toString()}`, { method: 'GET' });
      },
      create: async (data) => {
        return fetchApi('/mechanics.php', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      },
      update: async (id, data) => {
        return fetchApi(`/mechanics.php?id=${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      },
      delete: async (id) => {
        return fetchApi(`/mechanics.php?id=${id}`, { method: 'DELETE' });
      }
    },
    Review: {
      filter: async (params, sort = '') => {
        const urlParams = new URLSearchParams(params);
        if (sort) urlParams.append('sort', sort);
        return fetchApi(`/reviews.php?${urlParams.toString()}`, { method: 'GET' });
      },
      create: async (data) => {
        return fetchApi('/reviews.php', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      }
    }
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${BASE_URL}/upload.php`, {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to upload file');
        }
        return data;
      }
    }
  }
};
