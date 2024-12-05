package web.services;

import jakarta.inject.Qualifier;
import java.lang.annotation.*;

@Qualifier // квалификатор для CDI
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.TYPE, ElementType.METHOD})
public @interface AreaCheckQualifier {
}
