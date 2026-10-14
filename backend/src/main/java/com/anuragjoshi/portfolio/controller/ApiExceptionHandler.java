package com.anuragjoshi.portfolio.controller;

import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.TransactionException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.anuragjoshi.portfolio.service.ContactDeliveryException;
import com.anuragjoshi.portfolio.service.ContentNotFoundException;

/**
 * NFR-8: every failure becomes an RFC 9457 problem response with a human-readable {@code detail},
 * never a silent failure or a stack trace. Spring MVC's own errors (bad JSON, wrong method, 404)
 * are handled by the superclass in the same format.
 */
@RestControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

    /** 400 with an {@code errors} map of field name to message, for the contact form. */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage());
        }

        ProblemDetail problem = ex.getBody();
        problem.setDetail("Some fields need attention.");
        problem.setProperty("errors", errors);
        return handleExceptionInternal(ex, problem, headers, status, request);
    }

    @ExceptionHandler(ContentNotFoundException.class)
    public ProblemDetail handleContentNotFound(ContentNotFoundException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(ContactDeliveryException.class)
    public ProblemDetail handleContactDelivery(ContactDeliveryException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.SERVICE_UNAVAILABLE, ex.getMessage());
    }

    /** MySQL is down or unreachable: a query failed, or no connection was available to start a transaction. */
    @ExceptionHandler({DataAccessException.class, TransactionException.class})
    public ProblemDetail handleDatabaseUnavailable(RuntimeException ex) {
        log.error("Database request failed", ex);
        return ProblemDetail.forStatusAndDetail(
                HttpStatus.SERVICE_UNAVAILABLE, "The database is unavailable right now. Please try again later.");
    }
}
