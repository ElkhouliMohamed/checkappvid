import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\VideoController::store
 * @see app/Http/Controllers/VideoController.php:19
 * @route '/videos'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/videos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VideoController::store
 * @see app/Http/Controllers/VideoController.php:19
 * @route '/videos'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VideoController::store
 * @see app/Http/Controllers/VideoController.php:19
 * @route '/videos'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\VideoController::store
 * @see app/Http/Controllers/VideoController.php:19
 * @route '/videos'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VideoController::store
 * @see app/Http/Controllers/VideoController.php:19
 * @route '/videos'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\VideoController::show
 * @see app/Http/Controllers/VideoController.php:62
 * @route '/videos/{video}'
 */
export const show = (args: { video: number | { id: number } } | [video: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/videos/{video}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VideoController::show
 * @see app/Http/Controllers/VideoController.php:62
 * @route '/videos/{video}'
 */
show.url = (args: { video: number | { id: number } } | [video: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { video: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { video: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    video: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        video: typeof args.video === 'object'
                ? args.video.id
                : args.video,
                }

    return show.definition.url
            .replace('{video}', parsedArgs.video.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VideoController::show
 * @see app/Http/Controllers/VideoController.php:62
 * @route '/videos/{video}'
 */
show.get = (args: { video: number | { id: number } } | [video: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VideoController::show
 * @see app/Http/Controllers/VideoController.php:62
 * @route '/videos/{video}'
 */
show.head = (args: { video: number | { id: number } } | [video: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VideoController::show
 * @see app/Http/Controllers/VideoController.php:62
 * @route '/videos/{video}'
 */
    const showForm = (args: { video: number | { id: number } } | [video: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VideoController::show
 * @see app/Http/Controllers/VideoController.php:62
 * @route '/videos/{video}'
 */
        showForm.get = (args: { video: number | { id: number } } | [video: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VideoController::show
 * @see app/Http/Controllers/VideoController.php:62
 * @route '/videos/{video}'
 */
        showForm.head = (args: { video: number | { id: number } } | [video: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\VideoController::destroy
 * @see app/Http/Controllers/VideoController.php:69
 * @route '/videos/{video}'
 */
export const destroy = (args: { video: number | { id: number } } | [video: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/videos/{video}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\VideoController::destroy
 * @see app/Http/Controllers/VideoController.php:69
 * @route '/videos/{video}'
 */
destroy.url = (args: { video: number | { id: number } } | [video: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { video: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { video: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    video: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        video: typeof args.video === 'object'
                ? args.video.id
                : args.video,
                }

    return destroy.definition.url
            .replace('{video}', parsedArgs.video.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VideoController::destroy
 * @see app/Http/Controllers/VideoController.php:69
 * @route '/videos/{video}'
 */
destroy.delete = (args: { video: number | { id: number } } | [video: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\VideoController::destroy
 * @see app/Http/Controllers/VideoController.php:69
 * @route '/videos/{video}'
 */
    const destroyForm = (args: { video: number | { id: number } } | [video: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VideoController::destroy
 * @see app/Http/Controllers/VideoController.php:69
 * @route '/videos/{video}'
 */
        destroyForm.delete = (args: { video: number | { id: number } } | [video: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\VideoController::retry
 * @see app/Http/Controllers/VideoController.php:81
 * @route '/videos/{video}/retry'
 */
export const retry = (args: { video: number | { id: number } } | [video: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

retry.definition = {
    methods: ["post"],
    url: '/videos/{video}/retry',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VideoController::retry
 * @see app/Http/Controllers/VideoController.php:81
 * @route '/videos/{video}/retry'
 */
retry.url = (args: { video: number | { id: number } } | [video: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { video: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { video: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    video: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        video: typeof args.video === 'object'
                ? args.video.id
                : args.video,
                }

    return retry.definition.url
            .replace('{video}', parsedArgs.video.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VideoController::retry
 * @see app/Http/Controllers/VideoController.php:81
 * @route '/videos/{video}/retry'
 */
retry.post = (args: { video: number | { id: number } } | [video: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\VideoController::retry
 * @see app/Http/Controllers/VideoController.php:81
 * @route '/videos/{video}/retry'
 */
    const retryForm = (args: { video: number | { id: number } } | [video: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: retry.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VideoController::retry
 * @see app/Http/Controllers/VideoController.php:81
 * @route '/videos/{video}/retry'
 */
        retryForm.post = (args: { video: number | { id: number } } | [video: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: retry.url(args, options),
            method: 'post',
        })
    
    retry.form = retryForm
/**
* @see \App\Http\Controllers\VideoController::cancel
 * @see app/Http/Controllers/VideoController.php:99
 * @route '/videos/{video}/cancel'
 */
export const cancel = (args: { video: number | { id: number } } | [video: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/videos/{video}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VideoController::cancel
 * @see app/Http/Controllers/VideoController.php:99
 * @route '/videos/{video}/cancel'
 */
cancel.url = (args: { video: number | { id: number } } | [video: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { video: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { video: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    video: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        video: typeof args.video === 'object'
                ? args.video.id
                : args.video,
                }

    return cancel.definition.url
            .replace('{video}', parsedArgs.video.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VideoController::cancel
 * @see app/Http/Controllers/VideoController.php:99
 * @route '/videos/{video}/cancel'
 */
cancel.post = (args: { video: number | { id: number } } | [video: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\VideoController::cancel
 * @see app/Http/Controllers/VideoController.php:99
 * @route '/videos/{video}/cancel'
 */
    const cancelForm = (args: { video: number | { id: number } } | [video: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VideoController::cancel
 * @see app/Http/Controllers/VideoController.php:99
 * @route '/videos/{video}/cancel'
 */
        cancelForm.post = (args: { video: number | { id: number } } | [video: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(args, options),
            method: 'post',
        })
    
    cancel.form = cancelForm
const videos = {
    store: Object.assign(store, store),
show: Object.assign(show, show),
destroy: Object.assign(destroy, destroy),
retry: Object.assign(retry, retry),
cancel: Object.assign(cancel, cancel),
}

export default videos