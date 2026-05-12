// src/hooks/useJiraConfluence.js
// Jira/Confluence API와의 상호작용을 위한 React Query 훅

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { supabase } from '@/lib/supabase'

// API 프록시 요청 헬퍼
async function apiCall(endpoint, options = {}) {
  const { data: sessionData } = await supabase.auth.getSession()
  if (!sessionData.session) {
    throw new Error('Not authenticated')
  }

  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionData.session.access_token}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `API error: ${response.status}`)
  }

  return response.json()
}

// OAuth 통합 조회
export function useOAuthIntegrations() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['oauth-integrations', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      const { data, error } = await supabase
        .from('oauth_integrations')
        .select('*')
        .eq('user_id', user.id)
      if (error) throw error
      return data
    },
    enabled: !!user?.id,
  })
}

// Jira 이슈 검색
export function useSearchJiraIssues(jql, options = {}) {
  const { data: integrations } = useOAuthIntegrations()

  return useQuery({
    queryKey: ['jira-issues', jql, options],
    queryFn: async () => {
      if (!jql || !integrations?.length) return null

      const integration = integrations.find(i => i.provider === 'jira')
      if (!integration) throw new Error('Jira not connected')

      const params = new URLSearchParams({
        jql,
        cloudId: integration.cloud_id,
        maxResults: options.maxResults || 20,
      })

      return apiCall(`/api/jira/search?${params}`)
    },
    enabled: !!jql && !!integrations?.length,
    staleTime: options.staleTime || 1000 * 60 * 5, // 5분
  })
}

// Confluence 페이지 검색
export function useSearchConfluencePages(cql, options = {}) {
  const { data: integrations } = useOAuthIntegrations()

  return useQuery({
    queryKey: ['confluence-pages', cql, options],
    queryFn: async () => {
      if (!cql || !integrations?.length) return null

      const integration = integrations.find(i => i.provider === 'confluence')
      if (!integration) throw new Error('Confluence not connected')

      const params = new URLSearchParams({
        cql,
        cloudId: integration.cloud_id,
        limit: options.limit || 20,
      })

      return apiCall(`/api/confluence/search?${params}`)
    },
    enabled: !!cql && !!integrations?.length,
    staleTime: options.staleTime || 1000 * 60 * 5,
  })
}

// Jira 이슈 생성
export function useCreateJiraIssue() {
  const queryClient = useQueryClient()
  const { data: integrations } = useOAuthIntegrations()

  return useMutation({
    mutationFn: async (issueData) => {
      const integration = integrations?.find(i => i.provider === 'jira')
      if (!integration) throw new Error('Jira not connected')

      return apiCall('/api/jira/issues', {
        method: 'POST',
        body: JSON.stringify({
          cloudId: integration.cloud_id,
          fields: issueData,
        }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jira-issues'] })
    },
  })
}

// Confluence 페이지 생성
export function useCreateConfluencePage() {
  const queryClient = useQueryClient()
  const { data: integrations } = useOAuthIntegrations()

  return useMutation({
    mutationFn: async (pageData) => {
      const integration = integrations?.find(i => i.provider === 'confluence')
      if (!integration) throw new Error('Confluence not connected')

      return apiCall('/api/confluence/pages', {
        method: 'POST',
        body: JSON.stringify({
          cloudId: integration.cloud_id,
          ...pageData,
        }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['confluence-pages'] })
    },
  })
}

// Jira 프로젝트 조회
export function useJiraProjects() {
  const { data: integrations } = useOAuthIntegrations()

  return useQuery({
    queryKey: ['jira-projects', integrations],
    queryFn: async () => {
      if (!integrations?.length) return null

      const integration = integrations.find(i => i.provider === 'jira')
      if (!integration) throw new Error('Jira not connected')

      const params = new URLSearchParams({
        cloudId: integration.cloud_id,
      })

      return apiCall(`/api/jira/projects?${params}`)
    },
    enabled: !!integrations?.length,
    staleTime: Infinity, // 프로젝트는 자주 변경되지 않음
  })
}

// Confluence 스페이스 조회
export function useConfluenceSpaces() {
  const { data: integrations } = useOAuthIntegrations()

  return useQuery({
    queryKey: ['confluence-spaces', integrations],
    queryFn: async () => {
      if (!integrations?.length) return null

      const integration = integrations.find(i => i.provider === 'confluence')
      if (!integration) throw new Error('Confluence not connected')

      const params = new URLSearchParams({
        cloudId: integration.cloud_id,
      })

      return apiCall(`/api/confluence/spaces?${params}`)
    },
    enabled: !!integrations?.length,
    staleTime: Infinity,
  })
}
