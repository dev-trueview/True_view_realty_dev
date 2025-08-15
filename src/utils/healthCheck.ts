import { supabase } from '@/integrations/supabase/client';

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'down';
  service: string;
  responseTime: number;
  error?: string;
}

interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'down';
  services: HealthCheckResult[];
  timestamp: Date;
}

class HealthChecker {
  private async measureTime<T>(operation: () => Promise<T>): Promise<{ result: T; time: number }> {
    const start = performance.now();
    try {
      const result = await operation();
      const time = performance.now() - start;
      return { result, time };
    } catch (error) {
      const time = performance.now() - start;
      throw { error, time };
    }
  }

  private async checkDatabase(): Promise<HealthCheckResult> {
    try {
      const { result, time } = await this.measureTime(async () => {
        // Simple query to test database connectivity
        const { data, error } = await supabase
          .from('properties')
          .select('id')
          .limit(1);
        
        if (error) throw error;
        return data;
      });

      return {
        status: time < 1000 ? 'healthy' : 'degraded',
        service: 'Database',
        responseTime: Math.round(time),
      };
    } catch ({ error, time }: any) {
      return {
        status: 'down',
        service: 'Database',
        responseTime: Math.round(time),
        error: error?.message || 'Database connection failed',
      };
    }
  }

  private async checkAuth(): Promise<HealthCheckResult> {
    try {
      const { result, time } = await this.measureTime(async () => {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data;
      });

      return {
        status: time < 500 ? 'healthy' : 'degraded',
        service: 'Authentication',
        responseTime: Math.round(time),
      };
    } catch ({ error, time }: any) {
      return {
        status: 'down',
        service: 'Authentication',
        responseTime: Math.round(time),
        error: error?.message || 'Auth service failed',
      };
    }
  }

  private async checkStorage(): Promise<HealthCheckResult> {
    try {
      const { result, time } = await this.measureTime(async () => {
        // Test storage accessibility by listing buckets
        const { data, error } = await supabase.storage.listBuckets();
        if (error) throw error;
        return data;
      });

      return {
        status: time < 1000 ? 'healthy' : 'degraded',
        service: 'Storage',
        responseTime: Math.round(time),
      };
    } catch ({ error, time }: any) {
      return {
        status: 'down',
        service: 'Storage',
        responseTime: Math.round(time),
        error: error?.message || 'Storage service failed',
      };
    }
  }

  async performHealthCheck(): Promise<SystemHealth> {
    const healthChecks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkAuth(),
      this.checkStorage(),
    ]);

    const services: HealthCheckResult[] = healthChecks.map((result, index) => {
      const serviceNames = ['Database', 'Authentication', 'Storage'];
      
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          status: 'down',
          service: serviceNames[index],
          responseTime: 0,
          error: 'Health check failed to execute',
        };
      }
    });

    // Determine overall system health
    const downServices = services.filter(s => s.status === 'down').length;
    const degradedServices = services.filter(s => s.status === 'degraded').length;

    let overall: 'healthy' | 'degraded' | 'down';
    if (downServices > 0) {
      overall = downServices >= 2 ? 'down' : 'degraded';
    } else if (degradedServices > 0) {
      overall = 'degraded';
    } else {
      overall = 'healthy';
    }

    return {
      overall,
      services,
      timestamp: new Date(),
    };
  }

  async quickHealthCheck(): Promise<boolean> {
    try {
      // Quick database connectivity test
      const { error } = await supabase
        .from('properties')
        .select('id')
        .limit(1);
      
      return !error;
    } catch {
      return false;
    }
  }
}

export const healthChecker = new HealthChecker();
export type { SystemHealth, HealthCheckResult };