package com.example.vms.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;


@Aspect
@Component
public class AuditAspect {
    private static final Logger logger = LoggerFactory.getLogger(AuditAspect.class);


    @Pointcut("execution(* com.example.vms.service..*(..))")
    public void serviceLayer() {}


    @AfterReturning(pointcut = "serviceLayer()", returning = "retVal")
    public void logServiceAccess(JoinPoint jp, Object retVal) {
        logger.info("[AUDIT] {} called with args={} returned={}", jp.getSignature(), jp.getArgs(), retVal);
    }
}
